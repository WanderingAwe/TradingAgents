"""DataSource CRUD endpoints.

GET /api/v1/data-sources          - list data sources (paginated)
GET /api/v1/data-sources/{id}     - get data source by id
POST /api/v1/data-sources         - create data source
"""

from fastapi import APIRouter, HTTPException, Path, Query

from backend.api.deps import DBSession
from backend.models.datasource import DataSource
from backend.schemas.datasource import DataSourceCreate, DataSourceResponse

router = APIRouter()


@router.get(
    "/data-sources",
    response_model=list[DataSourceResponse],
    summary="List data sources",
)
def list_data_sources(
    db: DBSession,
    source_type: str | None = Query(default=None, description="Filter by source type"),
    is_active: bool | None = Query(default=None, description="Filter by active status"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
) -> list[DataSourceResponse]:
    """List data sources with optional filtering and pagination."""
    query = db.query(DataSource)
    if source_type is not None:
        query = query.filter(DataSource.source_type == source_type.upper())
    if is_active is not None:
        query = query.filter(DataSource.is_active == is_active)
    sources = query.offset(offset).limit(limit).all()
    return sources


@router.get(
    "/data-sources/{source_id}",
    response_model=DataSourceResponse,
    summary="Get data source by id",
)
def get_data_source(
    db: DBSession,
    source_id: int = Path(..., ge=1),
) -> DataSourceResponse:
    """Get a single data source by its database id."""
    source = db.get(DataSource, source_id)
    if source is None:
        raise HTTPException(status_code=404, detail="Data source not found")
    return source


@router.post(
    "/data-sources",
    response_model=DataSourceResponse,
    status_code=201,
    summary="Create data source",
)
def create_data_source(
    db: DBSession,
    payload: DataSourceCreate,
) -> DataSourceResponse:
    """Create a new data source. Duplicate source_code values are rejected."""
    existing = (
        db.query(DataSource)
        .filter(DataSource.source_code == payload.source_code)
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail=f"Data source with code {payload.source_code} already exists",
        )
    source = DataSource(**payload.model_dump())
    db.add(source)
    db.commit()
    db.refresh(source)
    return source
