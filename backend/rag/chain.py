from utils.openai import get_client_openai
def answer(query: str, chunks: list[str]) -> str:
    client = get_client_openai()
    joined_chunks = "\n\n".join(chunks)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "You are an advocate for Steven Jimenez. " +
                "You will be answer questions about his professional background and experience. " +
                "Answer only using the provided context. If the answer isn't in the context, say you don't know. " +
                "If you are asked something unrelated to Steven Jimenez, say that the question is out of scope."
            },
            {
                "role": "user",
                "content": "Using the following context: " + joined_chunks + "\n\n" + "Answer the question: " + query
            }
        ]
    )
    return response.choices[0].message.content


    
    