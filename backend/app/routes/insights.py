from flask import Blueprint, jsonify

insights_bp = Blueprint("insights", __name__)

@insights_bp.route("/weekly", methods=["GET"])
def weekly_insights():
    """Placeholder — in production calls Gemini 1.5 Flash."""
    return jsonify({
        "insights": [
            {
                "type": "recommendation",
                "title": "Reduce Car Usage",
                "body": "Switch to public transit 3x/week to save 520 kg CO₂e/year.",
                "impact": "High",
                "save_kg": 520,
            },
            {
                "type": "positive",
                "title": "Great Diet Choices",
                "body": "Your diet is already below the global average.",
                "impact": "Medium",
                "save_kg": 800,
            },
        ],
        "report_card": {
            "this_week_kg": 87.4,
            "last_week_kg": 91.8,
            "trend": "-4.8%",
        },
    }), 200

@insights_bp.route("/scenario", methods=["GET"])
def scenario():
    """What-if scenario calculator."""
    return jsonify({
        "scenarios": [
            {"label": "Go vegan for 1 year", "saving_kg": 1000},
            {"label": "Work from home 2 extra days/wk", "saving_kg": 400},
            {"label": "Install solar panels", "saving_kg": 1500},
            {"label": "Switch to EV", "saving_kg": 1200},
        ]
    }), 200
