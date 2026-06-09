from flask import Blueprint, request, jsonify
from datetime import datetime

activities_bp = Blueprint("activities", __name__)

# In-memory store (replace with Firestore in production)
_activities: list = []

@activities_bp.route("", methods=["POST"])
def log_activity():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    entry = {
        "id": str(len(_activities) + 1),
        "category": data.get("cat", "other"),
        "label": data.get("label", ""),
        "value": data.get("value", 0),
        "unit": data.get("unit", ""),
        "kg_co2e": data.get("kg", 0),
        "date": datetime.utcnow().isoformat(),
    }
    _activities.append(entry)
    return jsonify(entry), 201


@activities_bp.route("", methods=["GET"])
def get_activities():
    return jsonify({"activities": _activities, "count": len(_activities)}), 200
