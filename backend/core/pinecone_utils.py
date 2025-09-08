

from django.conf import settings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.docstore.document import Document
from .models import Doctor
from .specialization_data import SPECIALIZATION_DESCRIPTIONS
import re
from collections import defaultdict

PINECONE_INDEX_NAME = "health-doctors-hf"


embedding_model = HuggingFaceEmbeddings(
    model_name="multi-qa-MiniLM-L6-cos-v1",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)


pinecone_vectorstore = None
try:
    if all([settings.PINECONE_API_KEY, settings.PINECONE_ENVIRONMENT]):
        pinecone_vectorstore = PineconeVectorStore.from_existing_index(
            index_name=PINECONE_INDEX_NAME, 
            embedding=embedding_model
        )
        print("Pinecone vector store (Hugging Face) connected successfully.")
    else:
        print("Pinecone credentials missing. AI feature is disabled.")
except Exception as e:
    print(f"Error connecting to Pinecone: {e}. AI feature is disabled.")


def format_doctor_document(doctor: Doctor):
    """Creates a LangChain Document with enhanced content for better matching."""
    spec_data = SPECIALIZATION_DESCRIPTIONS.get(doctor.specialization, {})
    
    
    content_parts = []
    
    
    if 'core_focus' in spec_data:
        content_parts.append(spec_data['core_focus'])
    
    
    if 'symptoms_keywords' in spec_data:
        symptoms_text = "Common symptoms: " + ", ".join(spec_data['symptoms_keywords'][:10])
        content_parts.append(symptoms_text)
    
    
    if 'conditions_treated' in spec_data:
        conditions_text = "Conditions treated: " + ", ".join(spec_data['conditions_treated'][:8])
        content_parts.append(conditions_text)
    
    
    if 'procedures_tests' in spec_data:
        procedures_text = "Procedures: " + ", ".join(spec_data['procedures_tests'][:5])
        content_parts.append(procedures_text)
    
    
    comprehensive_description = ". ".join(content_parts)
    
    
    content_to_embed = f"passage: {comprehensive_description}"
    
    metadata = {
        "doctor_id": str(doctor.id),
        "name": doctor.user.get_full_name(),
        "specialization": doctor.specialization,
    }
    return Document(page_content=content_to_embed, metadata=metadata)


def find_keyword_matches(user_query: str):
    """
    Direct keyword matching using your specialization data
    Returns dict of {specialization: confidence_score}
    """
    user_query_lower = user_query.lower().strip()
    matches = {}
    
    for spec, data in SPECIALIZATION_DESCRIPTIONS.items():
        score = 0
        matched_items = []
        
        
        for symptom in data.get('symptoms_keywords', []):
            if symptom.lower() in user_query_lower:
                score += 0.8
                matched_items.append(f"symptom:{symptom}")
        
        
        for condition in data.get('conditions_treated', []):
            
            condition_words = [word for word in condition.lower().split() if len(word) > 3]
            if any(word in user_query_lower for word in condition_words):
                score += 0.6
                matched_items.append(f"condition:{condition}")
        
        
        for procedure in data.get('procedures_tests', []):
            if procedure.lower() in user_query_lower:
                score += 0.4
                matched_items.append(f"procedure:{procedure}")
        
        
        if len(matched_items) > 1:
            score *= 1.1
        
        
        if score > 0:
            matches[spec] = min(score, 1.0)
            print(f"Keyword match - {spec}: {matches[spec]:.4f} (matched: {matched_items[:2]})")
    
    return matches


def get_doctor_recommendations(user_query: str, top_k: int = 5, score_threshold: float = 0.7):
    """
    Enhanced recommendation system combining keyword + vector search
    """
    print(f"\n--- ENHANCED DEBUGGING ---")
    print(f"User Query: {user_query}")
    
    
    keyword_matches = find_keyword_matches(user_query)
    
    
    vector_matches = {}
    vector_results = []
    
    if pinecone_vectorstore is not None:
        try:
            prefixed_query = f"query: {user_query}"
            results_with_scores = pinecone_vectorstore.similarity_search_with_score(prefixed_query, k=top_k*2)
            
            print("\n--- VECTOR SEARCH RESULTS ---")
            for doc, score in results_with_scores:
                spec = doc.metadata.get('specialization')
                vector_matches[spec] = max(vector_matches.get(spec, 0), score)  
                print(f"  Vector Score: {score:.4f} | Spec: {spec}")
                vector_results.append((doc, score))
            
        except Exception as e:
            print(f"Vector search error: {e}")
    
    
    all_specializations = set(keyword_matches.keys()) | set(vector_matches.keys())
    combined_scores = {}
    
    print(f"\n--- COMBINED SCORING ---")
    for spec in all_specializations:
        keyword_score = keyword_matches.get(spec, 0)
        vector_score = vector_matches.get(spec, 0)
        
        
        if keyword_score > 0.7:
            
            combined_score = keyword_score * 0.8 + vector_score * 0.2
        elif keyword_score > 0 and vector_score > 0:
            
            combined_score = keyword_score * 0.6 + vector_score * 0.4 + 0.05  
        elif keyword_score > 0:
            
            combined_score = keyword_score * 0.7
        else:
            
            combined_score = vector_score * 0.8
        
        combined_scores[spec] = min(combined_score, 1.0)
        print(f"  {spec}: keyword={keyword_score:.3f}, vector={vector_score:.3f} → combined={combined_score:.4f}")
    
    
    adaptive_threshold = calculate_adaptive_threshold(combined_scores, score_threshold)
    print(f"\nAdaptive Threshold: {adaptive_threshold:.4f} (original: {score_threshold})")
    
    
    qualifying_specs = [(spec, score) for spec, score in combined_scores.items() 
                       if score >= adaptive_threshold]
    qualifying_specs.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\nQualifying Specializations:")
    for spec, score in qualifying_specs:
        print(f"  {spec}: {score:.4f}")
    
    
    recommended_doctors = []
    used_specializations = set()
    
    for spec, score in qualifying_specs:
        if spec not in used_specializations:
            doctors = Doctor.objects.filter(specialization=spec, is_active=True)
            if doctors.exists():
                
                spec_doctors = list(doctors[:2])
                recommended_doctors.extend(spec_doctors)
                used_specializations.add(spec)
                print(f"  Added {len(spec_doctors)} doctors from {spec}")
                
                if len(recommended_doctors) >= top_k:
                    break
    
    
    if not recommended_doctors:
        recommended_doctors = apply_fallbacks(keyword_matches, vector_results, top_k)
    
    print(f"--- END ENHANCED DEBUGGING ---\n")
    return recommended_doctors[:top_k]


def calculate_adaptive_threshold(combined_scores, original_threshold):
    """
    Calculate an adaptive threshold based on the score distribution
    """
    if not combined_scores:
        return original_threshold
    
    scores = list(combined_scores.values())
    max_score = max(scores)
    
    
    if max_score < original_threshold:
        adaptive_threshold = max_score * 0.7  
        
        adaptive_threshold = max(adaptive_threshold, 0.1)
        return adaptive_threshold
    
    return original_threshold


def apply_fallbacks(keyword_matches, vector_results, top_k):
    """
    Apply fallback strategies when primary matching fails
    """
    print("Applying fallback strategies...")
    
    
    if keyword_matches:
        best_spec = max(keyword_matches.items(), key=lambda x: x[1])[0]
        doctors = Doctor.objects.filter(specialization=best_spec, is_active=True)
        if doctors.exists():
            print(f"Fallback 1: Using best keyword match - {best_spec}")
            return list(doctors[:top_k])
    
    
    if vector_results:
        best_doc, _ = vector_results[0]
        best_spec = best_doc.metadata.get('specialization')
        doctors = Doctor.objects.filter(specialization=best_spec, is_active=True)
        if doctors.exists():
            print(f"Fallback 2: Using best vector match - {best_spec}")
            return list(doctors[:top_k])
    
    
    general_doctors = Doctor.objects.filter(
        specialization__icontains='General', 
        is_active=True
    )
    if general_doctors.exists():
        print("Fallback 3: Using General Practitioners")
        return list(general_doctors[:top_k])
    
    
    print("Fallback 4: Using any active doctors")
    return list(Doctor.objects.filter(is_active=True)[:top_k])



def upsert_doctor(doctor_id: int):
    """Upserts a single doctor to the Pinecone index with enhanced content."""
    if pinecone_vectorstore is None:
        return

    try:
        doctor = Doctor.objects.get(pk=doctor_id)
        if doctor.is_active:
            document = format_doctor_document(doctor)  
            pinecone_vectorstore.add_documents([document], ids=[str(doctor.id)])
            print(f"Successfully upserted Doctor ID: {doctor.id} to Pinecone with enhanced content.")
        else:
            delete_doctor(doctor_id)
    except Doctor.DoesNotExist:
        print(f"Doctor with ID {doctor_id} not found for upserting.")
    except Exception as e:
        print(f"Error upserting doctor {doctor_id}: {e}")


def delete_doctor(doctor_id: int):
    """Deletes a single doctor from the Pinecone index."""
    if pinecone_vectorstore is None:
        return
    try:
        pinecone_vectorstore.delete(ids=[str(doctor_id)])
        print(f"Successfully deleted Doctor ID: {doctor_id} from Pinecone.")
    except Exception as e:
        print(f"Error deleting doctor {doctor_id}: {e}")


def bulk_upsert_all_doctors():
    """
    Utility function to re-index all doctors with enhanced content
    Run this once to update your existing Pinecone index
    """
    if pinecone_vectorstore is None:
        print("Pinecone not available for bulk upsert")
        return
    
    active_doctors = Doctor.objects.filter(is_active=True)
    documents = []
    ids = []
    
    for doctor in active_doctors:
        document = format_doctor_document(doctor)
        documents.append(document)
        ids.append(str(doctor.id))
    
    try:
        pinecone_vectorstore.add_documents(documents, ids=ids)
        print(f"Successfully bulk upserted {len(documents)} doctors with enhanced content.")
    except Exception as e:
        print(f"Error in bulk upsert: {e}")