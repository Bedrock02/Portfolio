import os
from openai import OpenAI
from pinecone import Pinecone
import dotenv

def retrieve(query: str, top_k: int = 5) -> list[str]:
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dotenv.load_dotenv(os.path.join(dir_path, "../.env"))
    client_openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    client_pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = client_pinecone.Index(os.getenv("PINECONE_INDEX_NAME"))
    
    response = client_openai.embeddings.create(input=query, model="text-embedding-3-small")
    query_result = response.data[0]
    results = index.query(vector=query_result.embedding, top_k=top_k, include_metadata=True)
    return [match.metadata["text"] for match in results.matches]



    
    