"""Shared pytest fixtures for backend tests.

Uses a temporary SQLite database for each test so the developer's local
database is never touched.
"""

import os
import tempfile
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from backend.app import create_app
from backend.database import Base, get_db

# Import all models so they register with Base.metadata before create_all().
from backend.models import DataSource, Instrument, Observation  # noqa: F401


@pytest.fixture(scope="function")
def temp_db_path() -> Generator[str, None, None]:
    """Create a temporary SQLite database file path for a single test."""
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    yield path
    os.unlink(path)


@pytest.fixture(scope="function")
def db_session(temp_db_path: str) -> Generator[Session, None, None]:
    """Create a SQLAlchemy session bound to a temporary SQLite database."""
    database_url = f"sqlite:///{temp_db_path}"
    test_engine = create_engine(database_url, connect_args={"check_same_thread": False})

    # Enable foreign key enforcement on SQLite (PRAGMA foreign_keys = ON).
    @event.listens_for(test_engine, "connect")
    def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.close()

    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(bind=test_engine, autocommit=False, autoflush=False)
    session = TestSessionLocal()
    yield session
    session.close()
    test_engine.dispose()


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a FastAPI TestClient with a dependency override for the DB session."""
    app = create_app()

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
