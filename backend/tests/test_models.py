"""Tests for SQLAlchemy models."""

from datetime import UTC, datetime

import pytest
from sqlalchemy.exc import IntegrityError

from backend.models.datasource import DataSource
from backend.models.instrument import Instrument
from backend.models.observation import Observation


def test_instrument_creation(db_session):
    """Instrument can be created with all required fields."""
    instrument = Instrument(
        symbol="RELIANCE",
        name="Reliance Industries Ltd",
        exchange="NSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
        is_active=True,
    )
    db_session.add(instrument)
    db_session.commit()
    db_session.refresh(instrument)

    assert instrument.id is not None
    assert instrument.symbol == "RELIANCE"
    assert instrument.name == "Reliance Industries Ltd"
    assert instrument.exchange == "NSE"
    assert instrument.instrument_type == "EQUITY"
    assert instrument.currency == "INR"
    assert instrument.country_code == "IN"
    assert instrument.is_active is True
    assert instrument.created_at is not None
    assert instrument.updated_at is not None


def test_instrument_symbol_and_exchange_normalized(db_session):
    """Symbols and exchanges are stored as provided; no implicit normalization at DB level."""
    instrument = Instrument(
        symbol="reliance",
        name="Reliance Industries Ltd",
        exchange="nse",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    db_session.add(instrument)
    db_session.commit()
    # The DB stores values as-is; normalization is done by Pydantic schemas at the API layer.
    assert instrument.symbol == "reliance"
    assert instrument.exchange == "nse"


def test_instrument_duplicate_exchange_symbol_rejected(db_session):
    """Duplicate (exchange, symbol) combinations are rejected by unique constraint."""
    first = Instrument(
        symbol="TCS",
        name="Tata Consultancy Services",
        exchange="NSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    db_session.add(first)
    db_session.commit()

    duplicate = Instrument(
        symbol="TCS",
        name="Tata Consultancy Services",
        exchange="NSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    db_session.add(duplicate)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_instrument_same_symbol_different_exchange_allowed(db_session):
    """Same symbol on different exchanges is allowed."""
    first = Instrument(
        symbol="RELIANCE",
        name="Reliance Industries Ltd",
        exchange="NSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    second = Instrument(
        symbol="RELIANCE",
        name="Reliance Industries Ltd",
        exchange="BSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    db_session.add(first)
    db_session.add(second)
    db_session.commit()
    assert first.id is not None
    assert second.id is not None


def test_instrument_global_asset_types(db_session):
    """Instruments support global asset types, not just Indian equities."""
    crypto = Instrument(
        symbol="BTC",
        name="Bitcoin",
        exchange="COINBASE",
        instrument_type="CRYPTO",
        currency="USD",
        country_code="US",
    )
    forex = Instrument(
        symbol="EUR",
        name="Euro",
        exchange="FX",
        instrument_type="FOREX",
        currency="USD",
        country_code="EU",
    )
    index = Instrument(
        symbol="NIFTY 50",
        name="Nifty 50 Index",
        exchange="NSE",
        instrument_type="INDEX",
        currency="INR",
        country_code="IN",
    )
    db_session.add_all([crypto, forex, index])
    db_session.commit()
    assert crypto.instrument_type == "CRYPTO"
    assert forex.instrument_type == "FOREX"
    assert index.instrument_type == "INDEX"


def test_datasource_creation(db_session):
    """DataSource can be created with all required fields."""
    source = DataSource(
        source_code="YFINANCE",
        name="Yahoo Finance",
        provider="Yahoo",
        source_type="MARKET_DATA",
        is_active=True,
        source_url="https://finance.yahoo.com",
    )
    db_session.add(source)
    db_session.commit()
    db_session.refresh(source)

    assert source.id is not None
    assert source.source_code == "YFINANCE"
    assert source.name == "Yahoo Finance"
    assert source.provider == "Yahoo"
    assert source.source_type == "MARKET_DATA"
    assert source.is_active is True
    assert source.created_at is not None


def test_datasource_source_code_unique(db_session):
    """Duplicate source_code values are rejected by unique constraint."""
    first = DataSource(
        source_code="FRED",
        name="Federal Reserve Economic Data",
        provider="Federal Reserve",
        source_type="MACRO",
    )
    db_session.add(first)
    db_session.commit()

    duplicate = DataSource(
        source_code="FRED",
        name="FRED Duplicate",
        provider="Federal Reserve",
        source_type="MACRO",
    )
    db_session.add(duplicate)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_observation_creation_with_instrument_and_source(db_session):
    """Observation can be created with both data_source and instrument relationships."""
    source = DataSource(
        source_code="YFINANCE",
        name="Yahoo Finance",
        provider="Yahoo",
        source_type="MARKET_DATA",
    )
    instrument = Instrument(
        symbol="RELIANCE",
        name="Reliance Industries Ltd",
        exchange="NSE",
        instrument_type="EQUITY",
        currency="INR",
        country_code="IN",
    )
    db_session.add_all([source, instrument])
    db_session.commit()

    observed = datetime(2026, 1, 15, 9, 15, 0, tzinfo=UTC)
    observation = Observation(
        data_source_id=source.id,
        instrument_id=instrument.id,
        observation_type="PRICE",
        observed_at=observed,
        published_at=observed,
        numeric_value=2450.50,
        currency="INR",
        external_reference="RELIANCE.NS",
        raw_payload={"open": 2440.0, "high": 2460.0, "low": 2435.0, "close": 2450.50},
    )
    db_session.add(observation)
    db_session.commit()
    db_session.refresh(observation)

    assert observation.id is not None
    assert observation.data_source_id == source.id
    assert observation.instrument_id == instrument.id
    assert observation.observation_type == "PRICE"
    assert observation.numeric_value == 2450.50
    assert observation.currency == "INR"
    assert observation.retrieved_at is not None
    assert observation.created_at is not None


def test_observation_nullable_instrument_and_source(db_session):
    """Observation allows null data_source_id and instrument_id."""
    observation = Observation(
        observation_type="NEWS",
        observed_at=datetime(2026, 1, 15, 10, 0, 0, tzinfo=UTC),
        text_value="Market news headline",
    )
    db_session.add(observation)
    db_session.commit()
    db_session.refresh(observation)

    assert observation.data_source_id is None
    assert observation.instrument_id is None
    assert observation.text_value == "Market news headline"


def test_observation_foreign_key_set_null_on_source_delete(db_session):
    """Deleting a data source sets observation.data_source_id to NULL (no cascade delete)."""
    source = DataSource(
        source_code="TEST_SRC",
        name="Test Source",
        provider="Test",
        source_type="MARKET_DATA",
    )
    instrument = Instrument(
        symbol="TEST",
        name="Test Instrument",
        exchange="TEST",
        instrument_type="EQUITY",
        currency="USD",
        country_code="US",
    )
    db_session.add_all([source, instrument])
    db_session.commit()

    observation = Observation(
        data_source_id=source.id,
        instrument_id=instrument.id,
        observation_type="PRICE",
        observed_at=datetime(2026, 1, 15, 9, 0, 0, tzinfo=UTC),
        numeric_value=100.0,
    )
    db_session.add(observation)
    db_session.commit()

    db_session.delete(source)
    db_session.commit()

    db_session.refresh(observation)
    assert observation.data_source_id is None
    assert observation.instrument_id == instrument.id  # instrument unaffected


def test_observation_foreign_key_set_null_on_instrument_delete(db_session):
    """Deleting an instrument sets observation.instrument_id to NULL (no cascade delete)."""
    source = DataSource(
        source_code="TEST_SRC",
        name="Test Source",
        provider="Test",
        source_type="MARKET_DATA",
    )
    instrument = Instrument(
        symbol="TEST",
        name="Test Instrument",
        exchange="TEST",
        instrument_type="EQUITY",
        currency="USD",
        country_code="US",
    )
    db_session.add_all([source, instrument])
    db_session.commit()

    observation = Observation(
        data_source_id=source.id,
        instrument_id=instrument.id,
        observation_type="PRICE",
        observed_at=datetime(2026, 1, 15, 9, 0, 0, tzinfo=UTC),
        numeric_value=100.0,
    )
    db_session.add(observation)
    db_session.commit()

    db_session.delete(instrument)
    db_session.commit()

    db_session.refresh(observation)
    assert observation.instrument_id is None
    assert observation.data_source_id == source.id  # source unaffected


def test_observation_timestamps_distinct(db_session):
    """Observed, published, and retrieved timestamps are tracked distinctly."""
    source = DataSource(
        source_code="TEST_SRC",
        name="Test Source",
        provider="Test",
        source_type="MARKET_DATA",
    )
    db_session.add(source)
    db_session.commit()

    observed = datetime(2026, 1, 15, 9, 0, 0, tzinfo=UTC)
    published = datetime(2026, 1, 15, 9, 5, 0, tzinfo=UTC)
    observation = Observation(
        data_source_id=source.id,
        observation_type="PRICE",
        observed_at=observed,
        published_at=published,
        numeric_value=100.0,
    )
    db_session.add(observation)
    db_session.commit()
    db_session.refresh(observation)

    # SQLite does not preserve timezone info; compare wall-clock values.
    assert observation.observed_at.replace(tzinfo=UTC) == observed
    assert observation.published_at is not None
    assert observation.published_at.replace(tzinfo=UTC) == published
    assert observation.retrieved_at is not None
    assert observation.retrieved_at.replace(tzinfo=UTC) >= observed  # retrieval happens at or after observation
