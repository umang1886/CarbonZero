"""
CarbonZero — Chat FastAPI Router
"""
import logging
import os
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import google.generativeai as genai

logger = logging.getLogger(__name__)

router = APIRouter()

class ChatMessage(BaseModel):
    message: str = Field(..., max_length=2000, description="The user's message")
    footprint: Optional[Dict[str, Any]] = None
    history: List[Dict[str, Any]] = []

def _get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name="gemini-2.5-flash")

@router.post("/message")
def send_message(payload: ChatMessage):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    model = _get_model()
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    system_instruction = (
        "You are CarbonBot, an expert AI sustainability assistant. "
        "Keep responses concise, warm, and encouraging. Always end with a small actionable tip."
    )
    
    context = ""
    if payload.footprint:
        bd = payload.footprint.get("breakdown", {})
        tot = payload.footprint.get("total_kg_co2e", "?")
        context = f"[Context] Annual footprint: {tot} kg CO2e. Breakdown: {bd}\n\n"
        
    chat_history = [
        {"role": "user" if t.get("role") == "user" else "model", "parts": [str(t.get("content", ""))]}
        for t in payload.history[-10:]
    ]
    
    try:
        chat = model.start_chat(history=chat_history)
        response = chat.send_message(system_instruction + "\n\n" + context + payload.message)
        return {"reply": response.text}
    except Exception as exc:
        logger.exception("Gemini API Error")
        raise HTTPException(status_code=500, detail="AI service error")
