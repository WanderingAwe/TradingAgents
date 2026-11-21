"""System status endpoint.

GET /api/v1/system/status

Returns structured system information with explicit statuses for each
integration. Unimplemented integrations are reported as not_configured,
never as connected.
"""

from fastapi import APIRouter
from sqlalchemy import text

from backend.api.deps import DBSession
from backend.config import get_settings

router = APIRouter()

settings = get_settings()


@router.get("/system/status", summary="System status")
def system_status(db: DBSession) -> dict:
    """Return the status of all system components and integrations."""
    database_status = "disconnected"
    try:
        db.execute(text("SELECT 1"))
        database_status = "connected"
    except Exception:
        database_status = "disconnected"

    # Backend is always online if this endpoint responds
    return {
        "backend": "connected",
        "database": database_status,
        "research_execution": "not_configured",
        "market_data": "not_configured",
        "news_integration": "not_configured",
        "telegram_integration": "not_configured",
        "maritime_data": "not_configured",
        "aviation_data": "not_configured",
        "environment": settings.environment,
    }
