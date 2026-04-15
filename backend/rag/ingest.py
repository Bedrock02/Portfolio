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

    md_files = [f for f in os.listdir(data_dir) if f.endswith(".md")]
    print(f"Found {len(md_files)} markdown files: {md_files}")

    all_chunks = []
    all_ids = []

    for filename in md_files:
        with open(os.path.join(data_dir, filename), "r") as f:
            contents = f.read()
        chunks = [f"## {chunk}" for chunk in contents.split("## ") if chunk.strip()]
        slug = filename.replace(".md", "")
        ids = [f"{slug}-chunk-{i}" for i in range(len(chunks))]
        all_chunks.extend(chunks)
        all_ids.extend(ids)
        print(f"  {filename}: {len(chunks)} chunks")

    print(f"Generating embeddings for {len(all_chunks)} total chunks...")
    response = client_openai.embeddings.create(input=all_chunks, model="text-embedding-3-small")
    print("Upserting to Pinecone...")

    index.upsert(
        vectors=[
            {
                "id": chunk_id,
                "values": chunk_embedding.embedding,
                "metadata": {"text": chunk}
            }
            for chunk_id, chunk, chunk_embedding in zip(all_ids, all_chunks, response.data)
        ]
    )
    print("Ingestion complete")
    

if __name__ == "__main__":
    ingest()
