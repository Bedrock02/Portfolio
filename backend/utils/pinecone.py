import os
from pinecone import Pinecone
import dotenv
_dir_path = os.path.dirname(os.path.realpath(__file__))
dotenv.load_dotenv(os.path.join(_dir_path, "../.env"))

API_KEY=os.getenv("PINECONE_API_KEY")
client_pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = client_pinecone.Index(os.getenv("PINECONE_INDEX_NAME"))

def get_pinecone_client():
    return client_pinecone

def get_pinecone_index():
    return index
        