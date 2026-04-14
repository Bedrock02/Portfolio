import pdfplumber
import subprocess
import openai
import dotenv
import os


def process_resume():
    """
    1. Takes a PDF file path as a command-line argument (sys.argv[1]) // modifying this to just download from GH repo
    2. Opens the PDF with pdfplumber, loops over each page, and concatenates all the extracted text
    3. Sends that raw text to GPT-4o with a prompt asking it to reformat it as clean Markdown — specifically requesting:
        - A ## heading for each major section (Work Experience, Skills, Education, etc.)
        - A ## heading for each individual job (company + title + dates)
        - Bullet points for responsibilities and tech stack under each job
    4. Writes the result to backend/data/resume.md (create the data/ directory if it doesn't exist)
    5. Prints a confirmation message when done
    """
    dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
    data_dir = os.path.join(os.path.dirname(__file__), "../data")
    os.makedirs(data_dir, exist_ok=True)
    
    # check to see if resume latest exists, if it 
    if not os.path.exists(os.path.join(data_dir, "Resume_Latest.pdf")):
        subprocess.run(["curl", "-L", "-o", os.path.join(data_dir, "Resume_Latest.pdf"), "https://raw.githubusercontent.com/Bedrock02/resume/main/Resume_Latest.pdf"])
    
    resume_text = ""
    with pdfplumber.open(os.path.join(data_dir, "Resume_Latest.pdf")) as pdf:
        for page in pdf.pages:
            resume_text += page.extract_text() or ""
    
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that converts resumes to clean Markdown. "
                    "When formatting add a # heading for each major section (Work Experience, "
                    "Skills, Education, etc.). A ## heading for each individual job (company + "
                    "title + dates). Bullet points for responsibilities and tech stack under each job."
                )
            },
            {
                "role": "user",
                "content": resume_text
            }
        ]
    )
    
    with open(os.path.join(data_dir, "resume.md"), "w") as f:
        f.write(response.choices[0].message.content)

    print("Resume converted to Markdown")


if __name__ == "__main__":
    process_resume()
