import pytest
from unittest.mock import patch, MagicMock
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_send_message_missing_body(client):
    response = client.post("/api/v1/chat/message")
    assert response.status_code == 400
    assert "Missing required field" in response.get_json()["error"]

def test_send_message_empty_message(client):
    response = client.post("/api/v1/chat/message", json={"message": "   "})
    assert response.status_code == 400
    assert "must not be empty" in response.get_json()["error"]

def test_send_message_too_long(client):
    response = client.post("/api/v1/chat/message", json={"message": "a" * 2001})
    assert response.status_code == 400
    assert "exceeds maximum length" in response.get_json()["error"]

@patch("app.routes.chat._get_model")
def test_send_message_success(mock_get_model, client):
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
    assert response.get_json()["reply"] == "Hello! Here is your tip."

@patch("app.routes.chat._get_model")
def test_send_message_no_api_key(mock_get_model, client):
    mock_get_model.return_value = None
    response = client.post("/api/v1/chat/message", json={"message": "Hi"})
    assert response.status_code == 503
    assert "AI service is not available" in response.get_json()["error"]
