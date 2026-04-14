from pinecone import (Pinecone)
import dotenv
import openai
import os

def ingest():
    """
    1. Load .env (same pattern as before)
    2. Read backend/data/resume.md
    3. Split the text into chunks by ## headings — each chunk should include the heading itself so the context makes sense. The result should
    be a list of strings.
    4. Initialize the OpenAI client and the Pinecone client. For Pinecone, you'll use:
    from pinecone import Pinecone
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))
    5. For each chunk, call OpenAI to get its embedding:
    response = client.embeddings.create(input=chunk, model="text-embedding-3-small")
    embedding = response.data[0].embedding
    6. Upsert each chunk into Pinecone. Each record needs:
        - A unique id (e.g. f"chunk-{i}")
        - The values (the embedding vector)
        - metadata with the chunk text: {"text": chunk}
    7. Print progress as you go, and a completion message at the end
    """
    dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
    data_dir = os.path.join(os.path.dirname(__file__), "../data")
    client_pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = client_pinecone.Index(os.getenv("PINECONE_INDEX_NAME"))
    client_openai = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("Clients initialized")

    with open(os.path.join(data_dir, "resume.md"), "r") as f:
        contents = f.read()
    content_chunks = [f"## {chunk}" for chunk in contents.split("## ") if chunk.strip()]
    print(f"Split into {len(content_chunks)} chunks")
    print("Generating embeddings...")
    response = client_openai.embeddings.create(input=content_chunks, model="text-embedding-3-small")
    print("Upserting to Pinecone...")
    
    index.upsert(
        vectors=[
            {
                "id": f"chunk-{i}",
                "values": chunk_embedding.embedding,
                "metadata": {"text": chunk}
            }
            for i, (chunk, chunk_embedding) in enumerate(zip(content_chunks, response.data))
        ]
    )
    print("Ingestion complete")
    

if __name__ == "__main__":
    ingest()
