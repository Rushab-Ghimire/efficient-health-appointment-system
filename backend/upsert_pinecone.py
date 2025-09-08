

import os
import django
from langchain_pinecone import PineconeVectorStore


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()


from core.models import Doctor
from core.pinecone_utils import embedding_model, format_doctor_document, PINECONE_INDEX_NAME

def upsert_doctors_to_pinecone():

    print("Starting to upsert doctor data to Pinecone...")

    doctors = Doctor.objects.filter(is_active=True)
    if not doctors.exists():
        print("No active doctors found in the database. Nothing to upsert.")
        return
        
    print(f"Found {len(doctors)} active doctors to process.")

    print("Formatting documents...")
    documents = [format_doctor_document(doctor) for doctor in doctors]

    print(f"Upserting {len(documents)} documents to Pinecone index '{PINECONE_INDEX_NAME}'...")
    PineconeVectorStore.from_documents(
        documents, 
        embedding_model,
        index_name=PINECONE_INDEX_NAME
    )
    
    print("\nSUCCESS: Doctor data has been successfully upserted.")

if __name__ == "__main__":
    upsert_doctors_to_pinecone()