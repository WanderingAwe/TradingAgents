"""Tests for system status endpoint."""

from fastapi.testclient import TestClient


def test_system_status_shape(client: TestClient) -> None:
    """System status should return all expected components with explicit statuses."""
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()

    required_keys = [
        "backend", "database", "research_execution", "market_data",
        "news_integration", "telegram_integration", "maritime_data",
        "aviation_data", "environment",
    ]
    for key in required_keys:
        assert key in data, f"Missing key: {key}"

    assert data["backend"] == "connected"
    assert data["database"] == "connected"

    # Unimplemented integrations must not be reported as connected
    assert data["research_execution"] == "not_configured"
    assert data["market_data"] == "not_configured"
    assert data["news_integration"] == "not_configured"
    assert data["telegram_integration"] == "not_configured"
    assert data["maritime_data"] == "not_configured"
    assert data["aviation_data"] == "not_configured"
    assert data["environment"] == "development"


def test_system_status_database_connected(client: TestClient) -> None:
    """Database status should be connected when the test database is reachable."""
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["database"] == "connected"
