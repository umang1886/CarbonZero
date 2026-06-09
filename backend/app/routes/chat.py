from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os

chat_bp = Blueprint("chat", __name__)

# Lazily configure API key from env
def _get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash"
    )


@chat_bp.route("/message", methods=["POST"])
def send_message():
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' field"}), 400

    user_message = data["message"].strip()
    footprint_context = data.get("footprint")   # Optional: user's footprint data
    history = data.get("history", [])           # Optional: prior conversation turns

    model = _get_model()
    if not model:
        return jsonify({"error": "GEMINI_API_KEY not configured on server"}), 503

    # Build context preamble if footprint data is available
    context_note = (
        "System Instruction: You are CarbonBot, a friendly and expert AI sustainability assistant "
        "embedded in the CarbonZero platform. Your job is to help users understand "
        "their personal carbon footprint, give actionable advice to reduce emissions, "
        "and explain climate-related concepts clearly. "
        "When the user shares their footprint data, use it to give specific, "
        "personalized advice. Keep responses concise, warm, and encouraging. "
        "Use bullet points for lists. Always end with a small actionable tip.\n\n"
    )
    if footprint_context:
        bd = footprint_context.get("breakdown", {})
        total = footprint_context.get("total_kg_co2e", "unknown")
        context_note += (
            f"[User's Carbon Data] Annual footprint: {total} kg CO2e. "
            f"Breakdown — Transport: {bd.get('transport', '?')} kg, "
            f"Diet: {bd.get('diet', '?')} kg, "
            f"Energy: {bd.get('energy', '?')} kg, "
            f"Shopping: {bd.get('shopping', '?')} kg.\n\n"
        )

    # Rebuild chat history for multi-turn
    chat_history = []
    for turn in history[-10:]:   # keep last 10 turns for context window
        role = "user" if turn.get("role") == "user" else "model"
        chat_history.append({"role": role, "parts": [turn.get("content", "")]})

    chat = model.start_chat(history=chat_history)
    full_prompt = context_note + user_message if context_note else user_message

    try:
        response = chat.send_message(full_prompt)
        return jsonify({"reply": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
