import pytest
from app.services.footprint_service import (
    compute_footprint,
    validate_numeric_input,
    _clamp,
    MAX_VALUES,
)

def test_clamp():
    assert _clamp(500, "carPetrolKmWeek") == 500
    assert _clamp(-10, "carPetrolKmWeek") == 0
    assert _clamp(MAX_VALUES["carPetrolKmWeek"] + 1000, "carPetrolKmWeek") == MAX_VALUES["carPetrolKmWeek"]

def test_validate_numeric_input():
    data = {"valid": 10, "string": "20", "invalid": "abc"}
    
    assert validate_numeric_input(data, "valid") == 10.0
    assert validate_numeric_input(data, "string") == 20.0
    assert validate_numeric_input(data, "missing", default=5.0) == 5.0
    
    with pytest.raises(ValueError):
        validate_numeric_input(data, "invalid")

def test_compute_footprint_basic():
    payload = {
        "transport": {
            "carPetrolKmWeek": 100,
            "carElectricKmWeek": 0,
            "flightsPerYear": 2,
            "busKmWeek": 0,
            "trainKmWeek": 0
        },
        "dietType": "omnivore",
        "energy": {
            "electricityKwhMonth": 200,
            "naturalGasM3Month": 0
        },
        "shopping": {
            "clothingItemsYear": 10,
            "electronicsPerYear": 1
        }
    }
    result = compute_footprint(payload)
    
    assert result["breakdown"]["transport"] == 2010
    assert result["breakdown"]["diet"] == 2500
    assert result["breakdown"]["energy"] == 1968
    assert result["breakdown"]["shopping"] == 190
    assert result["total_kg_co2e"] == 6668

def test_compute_footprint_empty_payload():
    result = compute_footprint({})
    assert result["total_kg_co2e"] == 2500  # Default omnivore diet
    assert result["breakdown"]["transport"] == 0
    assert result["breakdown"]["energy"] == 0
    assert result["breakdown"]["shopping"] == 0

def test_compute_footprint_invalid_diet():
    result = compute_footprint({"dietType": "unknown_diet"})
    assert result["breakdown"]["diet"] == 2500  # Falls back to default
