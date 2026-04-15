from utils.openai import get_openai_client
import sentry_sdk

SYSTEM_PROMPT = (
    "You are an advocate for Steven Jimenez. "
    "You will answer questions about his professional background and experience. "
    "Answer only using the provided context. If the answer isn't in the context, say you don't know. "
    "If you are asked something unrelated to Steven Jimenez, say that the question is out of scope."
)

def answer(query: str, chunks: list[str]) -> str:
    client = get_openai_client()
    joined_chunks = "\n\n".join(chunks)

    with sentry_sdk.start_span(
        op="openai.chat.completions.create",
        description="Answer question with context") as span:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": "Using the following context: " + joined_chunks + "\n\n" + "Answer the question: " + query
                }
            ]
        )
        span.set_data("model", response.model)
        span.set_data("prompt_tokens", response.usage.prompt_tokens)
        span.set_data("completion_tokens", response.usage.completion_tokens)
        span.set_data("total_tokens", response.usage.total_tokens)
    return response.choices[0].message.content


def stream_answer(query: str, chunks: list[str]):
    client = get_openai_client()
    joined_chunks = "\n\n".join(chunks)

    with sentry_sdk.start_span(op="openai.chat.stream", description="Stream answer with GPT-4o") as span:
        stream = client.chat.completions.create(
            model="gpt-4o",
            stream=True,
            stream_options={"include_usage": True},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": "Using the following context: " + joined_chunks + "\n\nAnswer the question: " + query
                }
            ]
        )
        for chunk in stream:
            if chunk.usage:
                span.set_data("prompt_tokens", chunk.usage.prompt_tokens)
                span.set_data("completion_tokens", chunk.usage.completion_tokens)
            if not chunk.choices:
                continue
            content = chunk.choices[0].delta.content
            if content:
                yield content
