import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.main import create_app

app = create_app()
client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_footprint_calculate_success():
    payload = {
        "transport": {"carPetrolKmWeek": 100},
        "dietType": "vegan",
        "energy": {"electricityKwhMonth": 200},
        "shopping": {"clothingItemsYear": 10}
    }
    response = client.post("/api/v1/footprint/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "total_kg_co2e" in data
    assert "breakdown" in data
    assert data["breakdown"]["diet"] == 1500

def test_footprint_calculate_missing_body():
    response = client.post("/api/v1/footprint/calculate")
    # FastAPI returns 422 Unprocessable Entity for missing Pydantic bodies
    assert response.status_code == 422

def test_footprint_calculate_invalid_input():
    payload = {
        "transport": {"carPetrolKmWeek": "invalid_string"}
    }
    response = client.post("/api/v1/footprint/calculate", json=payload)
    assert response.status_code == 422

def test_get_latest_footprint_unauthorized():
    response = client.get("/api/v1/footprint/latest")
    assert response.status_code == 401

def test_send_message_missing_body():
    response = client.post("/api/v1/chat/message")
    assert response.status_code == 422

def test_send_message_empty_message():
    response = client.post("/api/v1/chat/message", json={"message": "   "})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_send_message_too_long():
    response = client.post("/api/v1/chat/message", json={"message": "a" * 2001})
    assert response.status_code == 422

@patch("app.api.routers.chat._get_model")
def test_send_message_success(mock_get_model):
    mock_model = MagicMock()
    mock_chat = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Hello! Here is your tip."
    mock_chat.send_message.return_value = mock_response
    mock_model.start_chat.return_value = mock_chat
    mock_get_model.return_value = mock_model

    payload = {
        "message": "How can I reduce my footprint?",
        "footprint": {
            "total_kg_co2e": 5000,
            "breakdown": {"transport": 2000}
        }
    }
    response = client.post("/api/v1/chat/message", json=payload)
    assert response.status_code == 200
    assert response.json()["reply"] == "Hello! Here is your tip."

@patch("app.api.routers.chat._get_model")
def test_send_message_no_api_key(mock_get_model):
    mock_get_model.return_value = None
    response = client.post("/api/v1/chat/message", json={"message": "Hi"})
    assert response.status_code == 503
