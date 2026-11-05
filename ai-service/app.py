from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Allow requests from other services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Request structure
class ChatRequest(BaseModel):
    message: str


# Home API
@app.get("/")
def home():
    return {
        "message": "Python AI Service is Running"
    }


# AI Chat API
@app.post("/chat")
def chat(data: ChatRequest):

    user_message = data.message

    # Send request to Ollama
    response = requests.post(
        "http://localhost:11434/api/chat",

        json={
            "model": "llama3.2:1b",

            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ],

            "stream": False
        },

        timeout=120
    )

    result = response.json()

    ai_response = result["message"]["content"]

    return {
        "question": user_message,
        "answer": ai_response
    }