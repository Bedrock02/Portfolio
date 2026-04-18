import os
import dotenv
import sentry_sdk
from sentry_sdk.integrations.starlette import StarletteIntegration
from sentry_sdk.integrations.fastapi import FastApiIntegration
from rag.retriever import retrieve
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rag.chain import answer, stream_answer
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

_dir_path = os.path.dirname(os.path.realpath(__file__))
dotenv.load_dotenv(os.path.join(_dir_path, "../.env"))

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[StarletteIntegration(), FastApiIntegration()],
    traces_sample_rate=1.0,
)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

MAX_QUERY_LENGTH = 300

class ChatRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "ok"}

def _log_chat_interaction(query: str, response: str, chunks_retrieved: int):
    sentry_sdk.set_context("chat", {
        "query": query,
        "response": response,
        "chunks_retrieved": chunks_retrieved,
    })
    sentry_sdk.capture_message("Chat interaction", level="info")

def _logged_stream(query: str, context: list):
    chunks = []
    for chunk in stream_answer(query, context):
        chunks.append(chunk)
        yield chunk
    _log_chat_interaction(query, "".join(chunks), len(context))

@app.post("/chat")
@limiter.limit("10/day")
def chat(request: Request, body: ChatRequest):
    if len(body.query) > MAX_QUERY_LENGTH:
        return JSONResponse(status_code=400, content={"error": f"Query must be {MAX_QUERY_LENGTH} characters or fewer."})
    context = retrieve(body.query)
    ai_answer = answer(body.query, context)
    _log_chat_interaction(body.query, ai_answer, len(context))
    return {"answer": ai_answer}

@app.post("/chat/stream")
@limiter.limit("10/day")
def chat_stream(request: Request, body: ChatRequest):
    if len(body.query) > MAX_QUERY_LENGTH:
        return JSONResponse(status_code=400, content={"error": f"Query must be {MAX_QUERY_LENGTH} characters or fewer."})
    context = retrieve(body.query)
    return StreamingResponse(
        _logged_stream(body.query, context),
        media_type="text/plain",
    )
