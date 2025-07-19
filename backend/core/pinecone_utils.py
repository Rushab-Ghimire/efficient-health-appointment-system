# core/pinecone_utils.py

from django.conf import settings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.docstore.document import Document
from .models import Doctor
from .specialization_data import SPECIALIZATION_DESCRIPTIONS

PINECONE_INDEX_NAME = "health-doctors-hf"

# --- DEFINE THE EMBEDDING MODEL ONCE, GLOBALLY ---
# This is our single source of truth for the embedding model.
embedding_model = HuggingFaceEmbeddings(
    model_name="multi-qa-MiniLM-L6-cos-v1",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

# --- INITIALIZE PINECONE CONNECTION ONCE, GLOBALLY ---
pinecone_vectorstore = None
try:
    if all([settings.PINECONE_API_KEY, settings.PINECONE_ENVIRONMENT]):
        pinecone_vectorstore = PineconeVectorStore.from_existing_index(
            index_name=PINECONE_INDEX_NAME, 
            embedding=embedding_model # Use the globally defined model
        )
        print("Pinecone vector store (Hugging Face) connected successfully.")
    else:
        print("Pinecone credentials missing. AI feature is disabled.")
except Exception as e:
    print(f"Error connecting to Pinecone: {e}. AI feature is disabled.")


def format_doctor_document(doctor: Doctor):
    """Creates a LangChain Document with a 'passage' prefix for embedding."""
    description = SPECIALIZATION_DESCRIPTIONS.get(
        doctor.specialization, 
        f"A doctor specializing in {doctor.specialization}."
    )
    content_to_embed = f"passage: This specialist treats the following: {description}"
    metadata = {
        "doctor_id": str(doctor.id),
        "name": doctor.user.get_full_name(),
        "specialization": doctor.specialization,
    }
    return Document(page_content=content_to_embed, metadata=metadata)


def get_doctor_recommendations(user_query: str, top_k: int = 5, score_threshold: float = 0.25):
    """
    Performs similarity search, filters by score, and returns ordered Doctor objects.
    """
    if pinecone_vectorstore is None:
        print("Search failed: Pinecone vector store not initialized.")
        return []
    
    try:
        # Add the 'query:' prefix for asymmetric search
        prefixed_query = f"query: {user_query}"
        
        # --- Perform the search ONLY ONCE ---
        results_with_scores = pinecone_vectorstore.similarity_search_with_score(prefixed_query, k=top_k)
        
        # Debugging print statements (great for testing)
        print("\n--- DEBUGGING SCORES ---")
        for doc, score in results_with_scores:
            print(f"  Score: {score:.4f} | Spec: {doc.metadata.get('specialization')}")
        print(f"Threshold: {score_threshold}")
        print("--- END DEBUGGING ---\n")
            
        # Filter results based on the score threshold
        confident_results = [doc for doc, score in results_with_scores if score >= score_threshold]
        
        if not confident_results:
            return []

        # Extract IDs and fetch from the database in the correct order
        doctor_ids = [doc.metadata.get('doctor_id') for doc in confident_results]
        clauses = ' '.join([f'WHEN id={id} THEN {i}' for i, id in enumerate(doctor_ids)])
        ordering = f'CASE {clauses} END'
        recommended_doctors = Doctor.objects.filter(id__in=doctor_ids, is_active=True).extra(
           select={'ordering': ordering}, order_by=('ordering',)
        )
        
        return list(recommended_doctors)
        
    except Exception as e:
        print(f"Error in get_doctor_recommendations: {e}")
        return []


def upsert_doctor(doctor_id: int):
    """Upserts a single doctor to the Pinecone index."""
    if pinecone_vectorstore is None:
        return

    try:
        doctor = Doctor.objects.get(pk=doctor_id)
        if doctor.is_active:
            document = format_doctor_document(doctor)
            pinecone_vectorstore.add_documents([document], ids=[str(doctor.id)])
            print(f"Successfully upserted Doctor ID: {doctor.id} to Pinecone.")
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