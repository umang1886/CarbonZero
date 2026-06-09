from flask import Blueprint, request, jsonify
from app.firebase_admin_setup import db
from app.middleware.auth import require_auth
from firebase_admin import auth

footprint_bp = Blueprint("footprint", __name__)

# ── IPCC-validated emission factors ──────────────────────
EMISSION_FACTORS = {
    "transport": {
        "car_petrol_km_week": 0.21,
        "car_electric_km_week": 0.07,
        "flights_per_year": 1800 * 0.255,
        "bus_km_week": 0.089,
        "train_km_week": 0.035,
    },
    "diet": {
        "vegan": 1500,
        "vegetarian": 1700,
        "omnivore": 2500,
        "heavy_meat": 3300,
    },
    "energy": {
        "electricity_kwh_month": 0.82,
        "natural_gas_m3_month": 2.04,
    },
    "shopping": {
        "clothing_items_year": 12.0,
        "electronics_per_year": 70.0,
    },
}

def calculate_transport(t: dict) -> float:
    f = EMISSION_FACTORS["transport"]
    return (
        t.get("carPetrolKmWeek", 0) * 52 * f["car_petrol_km_week"]
        + t.get("carElectricKmWeek", 0) * 52 * f["car_electric_km_week"]
        + t.get("flightsPerYear", 0) * f["flights_per_year"]
        + t.get("busKmWeek", 0) * 52 * f["bus_km_week"]
        + t.get("trainKmWeek", 0) * 52 * f["train_km_week"]
    )

def calculate_energy(e: dict) -> float:
    f = EMISSION_FACTORS["energy"]
    return (
        e.get("electricityKwhMonth", 0) * 12 * f["electricity_kwh_month"]
        + e.get("naturalGasM3Month", 0) * 12 * f["natural_gas_m3_month"]
    )

def calculate_shopping(s: dict) -> float:
    f = EMISSION_FACTORS["shopping"]
    return (
        s.get("clothingItemsYear", 0) * f["clothing_items_year"]
        + s.get("electronicsPerYear", 0) * f["electronics_per_year"]
    )

@footprint_bp.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    transport = calculate_transport(data.get("transport", {}))
    diet_key = data.get("dietType", "omnivore")
    diet = EMISSION_FACTORS["diet"].get(diet_key, 2500)
    energy = calculate_energy(data.get("energy", {}))
    shopping = calculate_shopping(data.get("shopping", {}))

    total = transport + diet + energy + shopping

    result = {
        "total_kg_co2e": round(total),
        "breakdown": {
            "transport": round(transport),
            "diet": round(diet),
            "energy": round(energy),
            "shopping": round(shopping),
        },
        "comparison": {
            "india_avg": 1900,
            "global_avg": 4800,
            "paris_target": 2000,
        },
    }

    # Optionally save if User is logged in
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer ") and db is not None:
        try:
            id_token = auth_header.split(" ")[1]
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token["uid"]
            
            # Save to Firestore
            doc_ref = db.collection("users").document(uid).collection("footprints").document("latest")
            doc_ref.set(result)
        except Exception as e:
            print("Failed to save footprint:", e)

    return jsonify(result), 200

@footprint_bp.route("/latest", methods=["GET"])
@require_auth
def get_latest_footprint():
    if db is None:
        return jsonify({"error": "Database not initialized"}), 500
        
    uid = request.user["uid"]
    doc_ref = db.collection("users").document(uid).collection("footprints").document("latest")
    doc = doc_ref.get()
    
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return jsonify({"error": "No footprint data found"}), 404
