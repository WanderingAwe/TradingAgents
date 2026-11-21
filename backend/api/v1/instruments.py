"""Instrument CRUD endpoints.

GET /api/v1/instruments          - list instruments (paginated)
GET /api/v1/instruments/{id}     - get instrument by id
POST /api/v1/instruments         - create instrument
"""

from fastapi import APIRouter, HTTPException, Path, Query

from backend.api.deps import DBSession
from backend.models.instrument import Instrument
from backend.schemas.instrument import InstrumentCreate, InstrumentResponse

router = APIRouter()


@router.get("/instruments", response_model=list[InstrumentResponse], summary="List instruments")
def list_instruments(
    db: DBSession,
    exchange: str | None = Query(default=None, description="Filter by exchange"),
    instrument_type: str | None = Query(default=None, description="Filter by instrument type"),
    is_active: bool | None = Query(default=None, description="Filter by active status"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> list[InstrumentResponse]:
    """List instruments with optional filtering and pagination."""
    query = db.query(Instrument)
    if exchange is not None:
        query = query.filter(Instrument.exchange == exchange.upper())
    if instrument_type is not None:
        query = query.filter(Instrument.instrument_type == instrument_type.upper())
    if is_active is not None:
        query = query.filter(Instrument.is_active == is_active)
    instruments = query.offset(offset).limit(limit).all()
    return instruments


@router.get(
    "/instruments/{instrument_id}",
    response_model=InstrumentResponse,
    summary="Get instrument by id",
)
def get_instrument(
    db: DBSession,
    instrument_id: int = Path(..., ge=1),
) -> InstrumentResponse:
    """Get a single instrument by its database id."""
    instrument = db.get(Instrument, instrument_id)
    if instrument is None:
        raise HTTPException(status_code=404, detail="Instrument not found")
    return instrument


@router.post(
    "/instruments",
    response_model=InstrumentResponse,
    status_code=201,
    summary="Create instrument",
)
def create_instrument(
    db: DBSession,
    payload: InstrumentCreate,
) -> InstrumentResponse:
    """Create a new instrument. Duplicate (exchange, symbol) pairs are rejected."""
    existing = (
        db.query(Instrument)
        .filter(Instrument.exchange == payload.exchange)
        .filter(Instrument.symbol == payload.symbol)
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail=f"Instrument {payload.symbol} already exists on exchange {payload.exchange}",
        )
    instrument = Instrument(**payload.model_dump())
    db.add(instrument)
    db.commit()
    db.refresh(instrument)
    return instrument
