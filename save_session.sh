#!/usr/bin/env bash
set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

if [[ ! -d docs ]]; then mkdir -p docs; fi

sanitize() {
  sed -E \
    -e 's/(OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|AZURE_OPENAI_API_KEY|XAI_API_KEY|DEEPSEEK_API_KEY|DASHSCOPE(_CN)?_API_KEY|ZHIPU(_CN)?_API_KEY|MINIMAX(_CN)?_API_KEY|OPENROUTER_API_KEY|MISTRAL_API_KEY|MOONSHOT_API_KEY|GROQ_API_KEY|NVIDIA_API_KEY|OPENAI_COMPATIBLE_API_KEY|FRED_API_KEY|ALPHA_VANTAGE_API_KEY|TYPESAFE_API_KEY)([=:])[[:space:]]*[^[:space:],;]+/\1\3<redacted>/Ig' \
    -e 's/(gh[pousr]_[A-Za-z0-9_]+)/<redacted>/g' \
    -e 's/(password|passwd|secret|token|api[_-]?key)([=:])[[:space:]]*[^[:space:],;]+/\1\2<redacted>/Ig'
}

ask() {
  local prompt="$1" var="$2" default="${3:-}"
  if [[ -n "${!var:-}" ]]; then
    printf '%s' "${!var}"
  elif [[ -t 0 ]]; then
    printf '%s' "$prompt" >&2
    read -r reply
    printf '%s' "${reply:-$default}"
  else
    printf '%s' "$default"
  fi
}

COMPLETED="$(ask 'What was completed? ' SAVE_COMPLETED 'No entry supplied.')"
IN_PROGRESS="$(ask 'What is currently in progress? ' SAVE_IN_PROGRESS 'No entry supplied.')"
NEXT_TASK="$(ask 'What should be done next? ' SAVE_NEXT 'Review the project state and choose the next pending task.')"
BLOCKERS="$(ask 'Any blockers or errors? ' SAVE_BLOCKERS 'None reported.')"

COMPLETED="$(printf '%s' "$COMPLETED" | sanitize | tr '\n' ' ')"
IN_PROGRESS="$(printf '%s' "$IN_PROGRESS" | sanitize | tr '\n' ' ')"
NEXT_TASK="$(printf '%s' "$NEXT_TASK" | sanitize | tr '\n' ' ')"
BLOCKERS="$(printf '%s' "$BLOCKERS" | sanitize | tr '\n' ' ')"

BRANCH="$(git branch --show-current 2>/dev/null || echo 'unknown')"
STATUS="$(git status --short --branch 2>/dev/null || echo 'Git status unavailable')"
LATEST="$(git --no-pager log -3 --oneline 2>/dev/null || echo 'Git log unavailable')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"

mkdir -p docs .local/logs .local/backups
LOG_FILE="docs/SESSION_LOG.md"
if [[ ! -f "$LOG_FILE" ]]; then
  cat > "$LOG_FILE" <<'EOF'
# Session Log

Chronological handover notes for TradingAgents development.
EOF
fi

cat >> "$LOG_FILE" <<EOF

## Session $TIMESTAMP

- Branch: $BRANCH
- Git status:
$(printf '%s\n' "$STATUS" | sed 's/^/  - /')
- Latest commits:
$(printf '%s\n' "$LATEST" | sed 's/^/  - /')
- What was completed: $COMPLETED
- Current work: $IN_PROGRESS
- Recommended next task: $NEXT_TASK
- Blockers/errors: $BLOCKERS
- Running development services:
EOF

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && [[ -f docker-compose.yml || -f compose.yml || -f compose.yaml ]]; then
  docker compose ps --all 2>&1 | sed 's/^/  - /' | sed -n '1,30p' >> "$LOG_FILE"
else
  echo '  - Docker services unavailable or Docker Compose is not configured.' >> "$LOG_FILE"
fi

cat >> "$LOG_FILE" <<EOF
- Recent application log locations:
  - .local/logs/
  - $HOME/.tradingagents/logs/ when present
  - results/ when present
EOF

if [[ ! -f docs/PROJECT_STATE.md ]]; then
  cat > docs/PROJECT_STATE.md <<'EOF'
# TradingAgents Project State

## Project objective
Build an India-first, globally compatible AI equity research engine for NSE/BSE and global markets, with evidence-backed reports and later PDF and Telegram delivery.

## Current architecture
Python/LangGraph multi-agent framework, yfinance/Alpha Vantage/SEC EDGAR/FRED vendors, CLI and HTML/Markdown reporting. No PostgreSQL or Telegram integration is implemented.

## Implementation status
Early repository discovery and Codespaces continuity tooling.

## Completed milestones
- Repository architecture audit completed.
- Codespaces startup and session recovery tooling installed.

## Active task
Maintain project continuity across Codespaces restarts.

## Pending tasks
- Add India instrument identity for NSE/BSE.
- Add structured evidence and provenance.
- Add India disclosures and market flows.
- Add worker, PostgreSQL and PDF delivery interfaces later.

## Important technical decisions
- Preserve the existing LangGraph architecture.
- Use free sources first; do not assume commercial redistribution rights.
- Do not implement automated trading or Telegram delivery in current phases.

## Known errors and blockers
No blockers recorded at initial setup.

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

- Branch: unknown
- Git status: unknown
- Latest checkpoint: unknown
- Completed: unknown
- In progress: unknown
- Blockers: unknown

Recommended next action: Review the repository and choose the next pending task.
<!-- saved-state:end -->
EOF
fi

BLOCK_FILE="$(mktemp)"
cat > "$BLOCK_FILE" <<EOF
## Saved current handover

- Branch: $BRANCH
- Git status:
$(printf '%s\n' "$STATUS" | sed 's/^/  - /')
- Latest checkpoint:
$(printf '%s\n' "$LATEST" | sed 's/^/  - /')
- Completed: $COMPLETED
- In progress: $IN_PROGRESS
- Blockers: $BLOCKERS

Recommended next action: $NEXT_TASK
EOF

STATE_TMP="$(mktemp)"
awk '
  FNR == NR { block=block (block=="" ? "" : "\n") $0; next }
  $0 == "<!-- saved-state:start -->" { print; print block; skip=1; next }
  $0 == "<!-- saved-state:end -->" { print; skip=0; next }
  !skip { print }
' "$BLOCK_FILE" docs/PROJECT_STATE.md > "$STATE_TMP"
mv "$STATE_TMP" docs/PROJECT_STATE.md
rm -f "$BLOCK_FILE"

printf 'Session checkpoint saved to %s\n' "$LOG_FILE"
printf 'Project handover updated in docs/PROJECT_STATE.md\n'
printf 'Branch: %s\n' "$BRANCH"
printf 'No files were staged, committed or pushed.\n'
