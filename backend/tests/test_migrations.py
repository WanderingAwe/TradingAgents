"""Tests for Alembic migrations.

Verifies that a fresh database can be migrated to the latest revision and
that the resulting schema matches the SQLAlchemy models.
"""

import os
import sys
import tempfile

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session

from backend.database import Base

# Ensure the repository root is importable so `backend` package resolves.
_repo_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if _repo_root not in sys.path:
    sys.path.insert(0, _repo_root)


def _run_migrations(db_url: str) -> None:
    """Run Alembic migrations against the given database URL."""
    ini_path = os.path.join(_repo_root, "backend", "alembic.ini")
    alembic_cfg = Config(ini_path)
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)
    alembic_cfg.set_main_option(
        "script_location",
        os.path.join(_repo_root, "backend", "alembic"),
    )
    command.upgrade(alembic_cfg, "head")


def test_fresh_database_migrates_to_head() -> None:
    """A fresh SQLite database can be migrated to the latest Alembic revision."""
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    try:
        db_url = f"sqlite:///{path}"
        _run_migrations(db_url)

        engine = create_engine(db_url)
        inspector = inspect(engine)
        table_names = set(inspector.get_table_names())

        # All model tables should exist after migration
        expected_tables = {"instruments", "data_sources", "observations", "alembic_version"}
        assert expected_tables.issubset(table_names), (
            f"Missing tables: {expected_tables - table_names}"
        )

        # Verify instruments table columns
        instrument_columns = {col["name"] for col in inspector.get_columns("instruments")}
        expected_instrument_cols = {
            "id", "symbol", "name", "exchange", "instrument_type", "currency",
            "country_code", "is_active", "created_at", "updated_at",
        }
        assert expected_instrument_cols.issubset(instrument_columns), (
            f"Missing instrument columns: {expected_instrument_cols - instrument_columns}"
        )

        # Verify data_sources table columns
        datasource_columns = {col["name"] for col in inspector.get_columns("data_sources")}
        expected_datasource_cols = {
            "id", "source_code", "name", "provider", "source_type", "is_active",
            "source_url", "terms_url", "created_at", "updated_at",
        }
        assert expected_datasource_cols.issubset(datasource_columns), (
            f"Missing datasource columns: {expected_datasource_cols - datasource_columns}"
        )

        # Verify observations table columns
        observation_columns = {col["name"] for col in inspector.get_columns("observations")}
        expected_observation_cols = {
            "id", "data_source_id", "instrument_id", "observation_type", "observed_at",
            "published_at", "retrieved_at", "numeric_value", "text_value", "unit",
            "currency", "external_reference", "source_url", "raw_payload",
            "created_at", "updated_at",
        }
        assert expected_observation_cols.issubset(observation_columns), (
            f"Missing observation columns: {expected_observation_cols - observation_columns}"
        )

        # Verify unique constraints exist
        instrument_constraints = inspector.get_unique_constraints("instruments")
        constraint_names = {c["name"] for c in instrument_constraints}
        assert "uq_instrument_exchange_symbol" in constraint_names

        datasource_constraints = inspector.get_unique_constraints("data_sources")
        ds_constraint_names = {c["name"] for c in datasource_constraints}
        assert "uq_datasource_source_code" in ds_constraint_names

        engine.dispose()
    finally:
        os.unlink(path)


def test_migration_schema_matches_models() -> None:
    """After migration, the database schema should be usable by SQLAlchemy models."""
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    try:
        db_url = f"sqlite:///{path}"
        _run_migrations(db_url)

        engine = create_engine(db_url)
        Base.metadata.create_all(engine)  # Should be idempotent, no errors

        session = Session(engine)
        # Basic read/write works after migration
        from backend.models.instrument import Instrument
        instrument = Instrument(
            symbol="TEST",
            name="Test",
            exchange="TEST",
            instrument_type="EQUITY",
            currency="USD",
            country_code="US",
        )
        session.add(instrument)
        session.commit()
        assert instrument.id is not None
        session.close()

        engine.dispose()
    finally:
        os.unlink(path)
