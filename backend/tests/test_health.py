"""Tests for health endpoints."""

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database import get_db


def test_health_live(client: TestClient) -> None:
    """Liveness endpoint should return alive without touching the database."""
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"


def test_health_ready_with_database(client: TestClient) -> None:
    """Readiness endpoint should report database connected when reachable."""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["database"] == "connected"


def test_health_ready_unavailable_returns_503() -> None:
    """Readiness endpoint should return 503 when the database is unreachable."""
    from backend.app import create_app

    engine = create_engine(
        "postgresql+psycopg2://user:password@127.0.0.1:9/trading_terminal",
        connect_args={"connect_timeout": 2},
    )
    SessionFactory = sessionmaker(bind=engine)
    session = SessionFactory()

    app = create_app()

    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        response = test_client.get("/api/v1/health/ready")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "not_ready"
        assert data["database"] == "disconnected"
