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

- Branch: feature/multi-panel-workstation
- Git status:
  - ## feature/multi-panel-workstation
  -  M .gitignore
  -  M README.md
  -  M main.py
  - ?? .devcontainer/
  - ?? .github/copilot-instructions.md
  - ?? THIRD_PARTY_NOTICES.md
  - ?? resume_session.sh
  - ?? save_session.sh
  - ?? start_command.sh
  - ?? web/
- Latest checkpoint:
  - 5b94813 docs: save development session checkpoint
  - 9fa1196 announce Trading-R1 official release
  - c454491 Merge pull request #1613 from TauricResearch/v0.7.1
- Completed: yes
- In progress: no
- Blockers: nope

Recommended next action: save file
<!-- saved-state:end -->

## Persistence and backup

The `.local/` directory contains local runtime data, logs and backups. It is ignored by Git. It persists inside the Codespace workspace where supported, but it is not guaranteed to survive Codespace deletion. Back up important reports or runtime data outside the Codespace before deleting or rebuilding it.

No PostgreSQL service or database storage is present in the inspected environment. Do not create or migrate a database in this task.
