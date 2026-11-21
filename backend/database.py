"""SQLAlchemy database layer.

Provides the engine, session factory, and declarative base used by all
backend modules. SQLite is the default local development database;
PostgreSQL is supported via DATABASE_URL for production.
"""

from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from backend.config import get_settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


_settings = get_settings()
_database_url = _settings.database_url

# Ensure the SQLite data directory exists when using a file-based SQLite DB.
if _database_url.startswith("sqlite:///"):
    _db_path = Path(_database_url.replace("sqlite:///", ""))
    _db_path.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    _database_url,
    echo=_settings.database_echo,
    # SQLite-specific: allow the same connection to be used across threads
    # (needed because FastAPI/Starlette may use thread pools).
    connect_args={"check_same_thread": False} if _database_url.startswith("sqlite") else {},
)


# SQLite does not enforce foreign key constraints by default. Enable them on
# every new connection so ON DELETE SET NULL and other FK behaviors work.
if _database_url.startswith("sqlite"):

    @event.listens_for(engine, "connect")
    def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    class_=Session,
)


def get_db() -> Session:
    """Yield a SQLAlchemy session and ensure it is closed afterwards.

    Intended for use as a FastAPI dependency:
    ```
    @app.get("/...")
    def endpoint(db: Session = Depends(get_db)):
        ...
    ```
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
