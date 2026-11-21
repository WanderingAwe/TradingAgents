"""API v1 router."""

from fastapi import APIRouter

from backend.api.v1 import datasources, health, instruments, observations, system

router = APIRouter()

router.include_router(health.router, tags=["Health"])
router.include_router(system.router, tags=["System"])
router.include_router(instruments.router, tags=["Instruments"])
router.include_router(datasources.router, tags=["Data Sources"])
router.include_router(observations.router, tags=["Observations"])
