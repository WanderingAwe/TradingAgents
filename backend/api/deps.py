"""API dependencies."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from backend.database import get_db

# Re-export for convenience
DBSession = Annotated[Session, Depends(get_db)]
