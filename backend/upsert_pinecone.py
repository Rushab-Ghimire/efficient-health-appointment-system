# upsert_pinecone.py

import os
import django
from langchain_pinecone import PineconeVectorStore

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# --- THIS IS THE KEY ---
# We only import the tools we need from our single source of truth.
from core.models import Doctor
from core.pinecone_utils import embedding_model, format_doctor_document, PINECONE_INDEX_NAME

def upsert_doctors_to_pinecone():
    """
    Fetches all active doctors, formats them using the centralized
    function, and upserts them to Pinecone using the centralized embedding model.
    """
    print("Starting to upsert doctor data to Pinecone...")

    # Load all active doctors from the database
    doctors = Doctor.objects.filter(is_active=True)
    if not doctors.exists():
        print("No active doctors found in the database. Nothing to upsert.")
        return
        
    print(f"Found {len(doctors)} active doctors to process.")

    # Use a list comprehension to format all doctors using our shared function
    print("Formatting documents...")
    documents = [format_doctor_document(doctor) for doctor in doctors]

    # Use the shared, imported embedding_model to create and upsert the documents
    print(f"Upserting {len(documents)} documents to Pinecone index '{PINECONE_INDEX_NAME}'...")
    PineconeVectorStore.from_documents(
        documents, 
        embedding_model, # <-- Using the shared model instance
        index_name=PINECONE_INDEX_NAME
    )
    
    print("\nSUCCESS: Doctor data has been successfully upserted.")

if __name__ == "__main__":
    upsert_doctors_to_pinecone()