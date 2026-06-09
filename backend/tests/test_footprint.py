import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_footprint_calculate_success(client):
    payload = {
        "transport": {"carPetrolKmWeek": 100},
        "dietType": "vegan",
        "energy": {"electricityKwhMonth": 200},
        "shopping": {"clothingItemsYear": 10}
    }
    response = client.post("/api/v1/footprint/calculate", json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert "total_kg_co2e" in data
    assert "breakdown" in data
    assert data["breakdown"]["diet"] == 1500

def test_footprint_calculate_missing_body(client):
    response = client.post("/api/v1/footprint/calculate")
    assert response.status_code == 400
    assert "Invalid or missing JSON" in response.get_json()["error"]

def test_footprint_calculate_invalid_input(client):
    payload = {
        "transport": {"carPetrolKmWeek": "invalid_string"}
    }
    response = client.post("/api/v1/footprint/calculate", json=payload)
    assert response.status_code == 400
    assert "Invalid input" in response.get_json()["error"]

def test_get_latest_footprint_unauthorized(client):
    response = client.get("/api/v1/footprint/latest")
    assert response.status_code == 401
    assert "Unauthorized" in response.get_json()["error"]
