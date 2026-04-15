from openai import OpenAI
import dotenv
import os
_dir_path = os.path.dirname(os.path.realpath(__file__))
dotenv.load_dotenv(os.path.join(_dir_path, "../.env"))

API_KEY=os.getenv("OPENAI_API_KEY")
model = "text-embedding-3-small"
client = OpenAI(api_key=API_KEY)

def get_client_openai():
    return client
        