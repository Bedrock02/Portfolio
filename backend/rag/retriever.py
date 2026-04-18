from utils.openai import get_openai_client
from utils.pinecone import get_pinecone_index
import sentry_sdk

def retrieve(query: str, top_k: int = 10) -> list[str]:
    client_openai = get_openai_client()
    index = get_pinecone_index()
    
    response = client_openai.embeddings.create(input=query, model="text-embedding-3-small")
    query_result = response.data[0]

    with sentry_sdk.start_span(op="pinecone.query", description="Retrieve resume chunks") as span:
        results = index.query(vector=query_result.embedding, top_k=top_k, include_metadata=True)
        span.set_data("chunks returned", len(results.matches))
    return [match.metadata["text"] for match in results.matches]



    
    