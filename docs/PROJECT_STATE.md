# TradingAgents Project State

## Project objective
Build an India-first, globally compatible AI equity research engine for NSE/BSE and global markets, with evidence-backed reports and later PDF and Telegram delivery.

## Current architecture
Python/LangGraph multi-agent framework, yfinance/Alpha Vantage/SEC EDGAR/FRED vendors, CLI and HTML/Markdown reporting. No PostgreSQL or Telegram integration is implemented.

## Implementation status
Repository discovery completed. Codespaces startup and session continuity tooling is being established.

## Completed milestones
- Repository architecture audit completed.
- Codespaces startup and session recovery tooling created.

## Active task
Make the development environment and project handover recoverable after Codespaces restarts.

## Pending tasks
- Add canonical NSE/BSE instrument identity.
- Add structured evidence and provenance.
- Add India-specific filings and disclosures.
- Add worker, PostgreSQL and PDF delivery interfaces later.

## Important technical decisions
- Preserve the existing LangGraph architecture.
- Use free sources first; do not assume commercial redistribution rights.
- Do not implement automated trading or Telegram delivery in this task.
- Keep source, runtime data and secrets in separate locations.

## Known errors and blockers
No implementation blocker verified at initial setup. The Docker daemon and Compose services should be checked per Codespace.

## Relevant files and entry points
- ./start_command.sh
- ./resume_session.sh
- ./save_session.sh
- cli/main.py
- tradingagents/graph/trading_graph.py
- tradingagents/dataflows/router.py
- tradingagents/reporting.py

<!-- saved-state:start -->
## Saved current handover

- Branch: feature/research-engine-first
- Git status:
  - ## feature/research-engine-first
  -  M backend/api/deps.py
  -  M backend/api/v1/observations.py
  -  M backend/api/v1/router.py
  -  M backend/config.py
  -  M backend/models/__init__.py
  -  M backend/models/datasource.py
  -  M backend/schemas/__init__.py
  -  M backend/schemas/datasource.py
  -  M backend/tests/conftest.py
  -  M backend/tests/test_api.py
  -  M backend/tests/test_migrations.py
  -  M docs/PROJECT_STATE.md
  -  M docs/SESSION_LOG.md
  -  M tests/test_graph_end_to_end.py
  -  M tradingagents/agents/analysts/turn.py
  -  M tradingagents/agents/tools.py
  -  M tradingagents/dataflows/config.py
  -  M tradingagents/dataflows/router.py
  -  M tradingagents/default_config.py
  -  M tradingagents/graph/trading_graph.py
  - ?? backend/alembic/versions/e4f6a7b8c9d0_extend_datasource_with_registry_columns.py
  - ?? backend/alembic/versions/e5a1b2c3d4e5_extend_datasource_with_permission_grants.py
  - ?? backend/api/v1/sources.py
  - ?? backend/schemas/contracts.py
  - ?? backend/services/
  - ?? backend/tests/test_contracts.py
  - ?? backend/tests/test_source_access.py
  - ?? backend/tests/test_source_registry.py
  - ?? tests/test_inference_enforcement.py
  - ?? tests/test_source_access_mode.py
  - ?? tests/test_source_access_router.py
- Latest checkpoint:
  - f238015 docs: save development session checkpoint
  - b77b1a9 docs: save development session checkpoint
  - f8ac752 chore: neutralize backend API description
- Completed: yes
- In progress: no
- Blockers: no

Recommended next action: save
<!-- saved-state:end -->

## Persistence and backup

The `.local/` directory contains local runtime data, logs and backups. It is ignored by Git. It persists inside the Codespace workspace where supported, but it is not guaranteed to survive Codespace deletion. Back up important reports or runtime data outside the Codespace before deleting or rebuilding it.

No PostgreSQL service or database storage is present in the inspected environment. Do not create or migrate a database in this task.
