import os
import dotenv
import sentry_sdk
from sentry_sdk.integrations.starlette import StarletteIntegration
from sentry_sdk.integrations.fastapi import FastApiIntegration
from rag.retriever import retrieve
from rag.chain import answer
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

_dir_path = os.path.dirname(os.path.realpath(__file__))
dotenv.load_dotenv(os.path.join(_dir_path, "../.env"))

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[StarletteIntegration(), FastApiIntegration()],
    traces_sample_rate=1.0,
)
app = FastAPI()

origins = [
    "https://wepadev.com",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(request: ChatRequest):
    context = retrieve(request.query)
    sentry_sdk.set_context("rag_query", {"query": request.query, "chunks_returned": len(context)})
    ai_answer = answer(request.query, context)
    return {"answer": ai_answer}