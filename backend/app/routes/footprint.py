"""
CarbonZero — Footprint Routes

Exposes REST endpoints for calculating and retrieving carbon footprint data.
Business logic is delegated to `app.services.footprint_service`.
"""
from __future__ import annotations

import logging
from flask import Blueprint, request, jsonify
from firebase_admin import auth

from app.firebase_admin_setup import db
from app.middleware.auth import require_auth
from app.services.footprint_service import compute_footprint

logger = logging.getLogger(__name__)

footprint_bp = Blueprint("footprint", __name__)


@footprint_bp.route("/calculate", methods=["POST"])
def calculate():
    """Calculate a user's annual carbon footprint.

    Accepts a JSON body with transport, dietType, energy, and shopping data.
    Optionally saves the result to Firestore if a valid Bearer token is provided.

    Returns:
        200: JSON with total_kg_co2e, breakdown, and comparison.
        400: If the request body is missing or a field is invalid.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON request body"}), 400

    try:
        result = compute_footprint(data)
    except ValueError as exc:
        logger.warning("Footprint validation error: %s", exc)
        return jsonify({"error": "Invalid input", "message": str(exc)}), 400

    # Optionally persist if the user is authenticated
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer ") and db is not None:
        id_token = auth_header.split(" ", 1)[1]
        try:
            decoded = auth.verify_id_token(id_token)
            uid = decoded["uid"]
            (
                db.collection("users")
                .document(uid)
                .collection("footprints")
                .document("latest")
                .set(result)
            )
            logger.info("Saved footprint for uid=%s", uid)
        except Exception as exc:  # noqa: BLE001
            # Non-fatal: log and continue — the result is still returned
            logger.warning("Could not save footprint for user: %s", exc)

    return jsonify(result), 200


@footprint_bp.route("/latest", methods=["GET"])
@require_auth
def get_latest_footprint():
    """Retrieve the most recently saved footprint for the authenticated user.

    Returns:
        200: The saved footprint document.
        404: If no footprint has been saved yet.
        500: If the database is unavailable.
    """
    if db is None:
        logger.error("Firestore client is not initialized.")
        return jsonify({"error": "Database not available"}), 500

    uid = request.user["uid"]
    doc = (
        db.collection("users")
        .document(uid)
        .collection("footprints")
        .document("latest")
        .get()
    )

    if doc.exists:
        return jsonify(doc.to_dict()), 200

    return jsonify({"error": "No footprint data found for this user"}), 404
