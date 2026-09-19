import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from groq import Groq
from dotenv import load_dotenv
from services.mock_db import bins_db

load_dotenv()

router = APIRouter(tags=["ai"])

class ChatRequest(BaseModel):
    message: str

class InsightRequest(BaseModel):
    data: Dict[str, Any]

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None
groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
fleet_ids = ["TRK-01", "TRK-02", "TRK-03"]

@router.post("/ai/insight")
def get_ai_insight(req: InsightRequest) -> Dict[str, str]:
    if not client:
        return {"insight": "Groq API key not configured. Mock: Based on the bin data, we recommend scheduling an urgent collection for these areas immediately."}
        
    try:
        completion = client.chat.completions.create(
            model=groq_model,
            messages=[
                {"role": "system", "content": "You are Smart Waste AI. Provide a one-sentence insight based on the provided JSON data about city waste bins."},
                {"role": "user", "content": str(req.data)}
            ],
            temperature=0.7,
            max_tokens=256
        )
        return {"insight": completion.choices[0].message.content}
    except Exception as e:
        return {"insight": f"Error calling Groq API: {str(e)}"}

@router.post("/ai/chat")
def get_ai_chat(req: ChatRequest) -> Dict[str, str]:
    if re.search(r"\b(how many|number of|count of|count)\b.*\b(trucks?|vehicles?|fleet)\b|\b(trucks?|vehicles?|fleet)\b.*\b(how many|number|count)\b", req.message, re.IGNORECASE):
        return {"reply": f"There are {len(fleet_ids)} trucks in the active fleet: {', '.join(fleet_ids)}."}

    if not client:
        return {"reply": "Groq API key not configured. Mock reply: Please set your GROQ_API_KEY in the backend/.env file and restart the server to chat with the AI."}

    # Prepare real-time context
    total_bins = len(bins_db)
    critical_bins = sum(1 for b in bins_db.values() if b.fill_level > 80)
    critical_details = [f"Bin {b.bin_id} in {b.area} ({b.fill_level}%)" for b in bins_db.values() if b.fill_level > 80]
    
    context = f"CURRENT LIVE DATA: Total Bins: {total_bins}, Critical Bins: {critical_bins}, Active Trucks: {len(fleet_ids)} ({', '.join(fleet_ids)})."
    if critical_bins > 0:
        context += f" Critical Bin Details: {', '.join(critical_details)}."

    try:
        completion = client.chat.completions.create(
            model=groq_model,
            messages=[
                {"role": "system", "content": f"You are Smart Waste AI, an intelligent logistics assistant for Coimbatore city waste management. Answer strictly using this real-time system state: {context} Keep answers concise and under 3 sentences."},
                {"role": "user", "content": req.message}
            ],
            temperature=0.7,
            max_tokens=256
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        return {"reply": "The AI service is temporarily unavailable. Live fleet data is still available: there are 3 active trucks (TRK-01, TRK-02, and TRK-03)."}
