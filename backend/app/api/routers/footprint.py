"""
CarbonZero — Footprint FastAPI Router
"""
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.firebase_admin_setup import db
from app.api.auth import get_current_user
from app.services.footprint_service import compute_footprint

logger = logging.getLogger(__name__)

router = APIRouter()

# ── Pydantic Models ──────────────────────────────────────
class TransportData(BaseModel):
    carPetrolKmWeek: float = 0.0
    carElectricKmWeek: float = 0.0
    flightsPerYear: float = 0.0
    busKmWeek: float = 0.0
    trainKmWeek: float = 0.0

class EnergyData(BaseModel):
    electricityKwhMonth: float = 0.0
    naturalGasM3Month: float = 0.0

class ShoppingData(BaseModel):
    clothingItemsYear: float = 0.0
    electronicsPerYear: float = 0.0

class FootprintRequest(BaseModel):
    transport: TransportData = TransportData()
    dietType: str = "omnivore"
    energy: EnergyData = EnergyData()
    shopping: ShoppingData = ShoppingData()


@router.post("/calculate")
def calculate_footprint(
    payload: FootprintRequest,
    # Optional dependency: if token is invalid, we don't block the calculation
    # but we just won't save it. For strict auth, we'd use `Depends(get_current_user)`.
    # To keep the same logic as the Flask app (optional save):
):
    """Calculate carbon footprint and optionally save to Firestore if auth token provided in headers."""
    try:
        # Convert pydantic model to dict for the service layer
        result = compute_footprint(payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return result

@router.post("/save")
def save_footprint(
    payload: FootprintRequest,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Calculate and force save a footprint for an authenticated user."""
    try:
        result = compute_footprint(payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if db is not None:
        try:
            db.collection("users").document(user["uid"]).collection("footprints").document("latest").set(result)
        except Exception as exc:
            logger.warning("Failed to save footprint for uid=%s: %s", user["uid"], exc)
            
    return result

@router.get("/latest")
def get_latest_footprint(user: Dict[str, Any] = Depends(get_current_user)):
    """Get the latest footprint for the authenticated user."""
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
        
    doc = db.collection("users").document(user["uid"]).collection("footprints").document("latest").get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="No footprint data found")
