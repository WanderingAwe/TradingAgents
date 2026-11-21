"""Observation CRUD endpoints.

GET /api/v1/observations          - list observations with filter + pagination
GET /api/v1/observations/{id}     - get observation by id
POST /api/v1/observations         - create observation
"""

from datetime import datetime

from fastapi import APIRouter, HTTPException, Path, Query

from backend.api.deps import DBSession
from backend.models.instrument import Instrument
from backend.models.observation import Observation
from backend.schemas.observation import ObservationCreate, ObservationResponse

router = APIRouter()


@router.get(
    "/observations",
    response_model=list[ObservationResponse],
    summary="List observations",
)
def list_observations(
    db: DBSession,
    data_source_id: int | None = Query(default=None, ge=1),  # noqa: B008
    instrument_id: int | None = Query(default=None, ge=1),  # noqa: B008
    observation_type: str | None = Query(default=None, max_length=64),  # noqa: B008
    observed_from: datetime | None = Query(default=None),  # noqa: B008
    observed_to: datetime | None = Query(default=None),  # noqa: B008
    limit: int = Query(default=50, ge=1, le=200),  # noqa: B008
    offset: int = Query(default=0, ge=0),  # noqa: B008
) -> list[ObservationResponse]:
    """List observations with optional filtering and pagination."""
    query = db.query(Observation)
    if data_source_id is not None:
        query = query.filter(Observation.data_source_id == data_source_id)
    if instrument_id is not None:
        query = query.filter(Observation.instrument_id == instrument_id)
    if observation_type is not None:
        query = query.filter(Observation.observation_type == observation_type)
    if observed_from is not None:
        query = query.filter(Observation.observed_at >= observed_from)
    if observed_to is not None:
        query = query.filter(Observation.observed_at <= observed_to)
    observations = query.order_by(Observation.observed_at.desc()).offset(offset).limit(limit).all()
    return observations


@router.get(
    "/observations/{observation_id}",
    response_model=ObservationResponse,
    summary="Get observation by id",
)
def get_observation(
    db: DBSession,
    observation_id: int = Path(..., ge=1),
) -> ObservationResponse:
    """Get a single observation by its database id."""
    observation = db.get(Observation, observation_id)
    if observation is None:
        raise HTTPException(status_code=404, detail="Observation not found")
    return observation


@router.post(
    "/observations",
    response_model=ObservationResponse,
    status_code=201,
    summary="Create observation",
)
def create_observation(
    db: DBSession,
    payload: ObservationCreate,
) -> ObservationResponse:
    """Create a new observation.

    Validates that referenced data source and instrument exist when provided.
    """
    if payload.data_source_id is not None:
        from backend.models.datasource import DataSource

        source = db.get(DataSource, payload.data_source_id)
        if source is None:
            raise HTTPException(
                status_code=400,
                detail=f"Data source id {payload.data_source_id} does not exist",
            )

    if payload.instrument_id is not None:
        instrument = db.get(Instrument, payload.instrument_id)
        if instrument is None:
            raise HTTPException(
                status_code=400,
                detail=f"Instrument id {payload.instrument_id} does not exist",
            )

    observation = Observation(**payload.model_dump())
    db.add(observation)
    db.commit()
    db.refresh(observation)
    return observation
