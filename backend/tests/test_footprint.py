import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_footprint_calculation(client):
    """
    Test the /api/v1/footprint/calculate endpoint to validate the math logic.
    Provides mock user data and checks if the calculated CO2e matches the expected IPCC logic.
    """
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
    
    response = client.post("/api/v1/footprint/calculate", json=payload)
    assert response.status_code == 200
    
    data = response.get_json()
    assert "total_kg_co2e" in data
    assert "breakdown" in data
    
    # Check breakdown calculations
    # Transport: 100 * 52 * 0.21 + 2 * 1800 * 0.255 = 1092 + 918 = 2010
    assert data["breakdown"]["transport"] == 2010
    
    # Diet: omnivore = 2500
    assert data["breakdown"]["diet"] == 2500
    
    # Energy: 200 * 12 * 0.82 = 1968
    assert data["breakdown"]["energy"] == 1968
    
    # Shopping: 10 * 12.0 + 1 * 70 = 120 + 70 = 190
    assert data["breakdown"]["shopping"] == 190
    
    # Total: 2010 + 2500 + 1968 + 190 = 6668
    assert data["total_kg_co2e"] == 6668
    
    # Check comparison exists
    assert "comparison" in data
    assert data["comparison"]["india_avg"] == 1900
    assert data["comparison"]["global_avg"] == 4800
