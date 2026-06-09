"""
CarbonZero — Chat Routes

Exposes the AI chatbot endpoint, backed by Google Gemini.
"""
from __future__ import annotations

import logging
import os
from flask import Blueprint, request, jsonify
import google.generativeai as genai

logger = logging.getLogger(__name__)

chat_bp = Blueprint("chat", __name__)

# Limits
MAX_MESSAGE_LENGTH = 2_000   # characters
MAX_HISTORY_TURNS  = 10      # kept turns for context window

_SYSTEM_INSTRUCTION = (
    "You are CarbonBot, a friendly and expert AI sustainability assistant "
    "embedded in the CarbonZero platform. Your job is to help users understand "
    "their personal carbon footprint, give actionable advice to reduce emissions, "
    "and explain climate-related concepts clearly. "
    "When the user shares their footprint data, use it to give specific, "
    "personalized advice. Keep responses concise, warm, and encouraging. "
    "Use bullet points for lists. Always end with a small actionable tip."
)


def _get_model() -> genai.GenerativeModel | None:
    """Lazily initialize and return the Gemini generative model.

    Returns:
        A configured GenerativeModel, or None if GEMINI_API_KEY is not set.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY environment variable is not set.")
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name="gemini-2.5-flash")


def _build_context(footprint_context: dict | None) -> str:
    """Build a footprint context string to prepend to the user prompt.

    Args:
        footprint_context: Optional dict with total_kg_co2e and breakdown.

    Returns:
        A formatted context string, or empty string if no context provided.
    """
    if not footprint_context:
        return ""
    bd    = footprint_context.get("breakdown", {})
    total = footprint_context.get("total_kg_co2e", "unknown")
    return (
        f"[User's Carbon Data] Annual footprint: {total} kg CO2e. "
        f"Breakdown — Transport: {bd.get('transport', '?')} kg, "
        f"Diet: {bd.get('diet', '?')} kg, "
        f"Energy: {bd.get('energy', '?')} kg, "
        f"Shopping: {bd.get('shopping', '?')} kg.\n\n"
    )


@chat_bp.route("/message", methods=["POST"])
def send_message():
    """Send a message to the CarbonBot AI and receive a response.

    Request body (JSON):
        message (str, required):  The user's message (max 2000 chars).
        footprint (dict, optional): The user's calculated footprint data.
        history (list, optional):   Prior conversation turns.

    Returns:
        200: JSON with a ``reply`` key containing the AI response.
        400: If ``message`` is missing or exceeds the length limit.
        503: If GEMINI_API_KEY is not configured.
        500: If the Gemini API call fails.
    """
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "Missing required field: 'message'"}), 400

    user_message = str(data["message"]).strip()
    if not user_message:
        return jsonify({"error": "'message' must not be empty"}), 400
    if len(user_message) > MAX_MESSAGE_LENGTH:
        return jsonify({
            "error": f"'message' exceeds maximum length of {MAX_MESSAGE_LENGTH} characters"
        }), 400

    model = _get_model()
    if not model:
        return jsonify({"error": "AI service is not available. GEMINI_API_KEY not configured."}), 503

    footprint_context = data.get("footprint")
    history           = data.get("history", [])

    # Build context preamble
    context_note = _SYSTEM_INSTRUCTION + "\n\n" + _build_context(footprint_context)

    # Rebuild multi-turn history (keep last N turns)
    chat_history = [
        {
            "role": "user" if turn.get("role") == "user" else "model",
            "parts": [str(turn.get("content", ""))],
        }
        for turn in history[-MAX_HISTORY_TURNS:]
    ]

    chat = model.start_chat(history=chat_history)
    full_prompt = context_note + user_message

    try:
        response = chat.send_message(full_prompt)
        logger.info("Chat response generated successfully.")
        return jsonify({"reply": response.text}), 200
    except Exception as exc:  # noqa: BLE001
        logger.exception("Gemini API error: %s", exc)
        return jsonify({"error": "AI service error", "message": str(exc)}), 500
