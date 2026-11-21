#!/usr/bin/env bash
set -uo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

usage() {
  cat <<'EOF'
Usage: ./start_command.sh [--help|--status|--check|--web]

  (default)  Validate the environment and run the website in this terminal.
  --status   Show environment and service status only; do not start or create.
  --check    Lightweight, non-interactive validation for Codespaces startup.
  --web      Same as the default: run the Research Studio frontend on port 5173.
  --help     Show this help.
EOF
}

MODE="web"
case "${1:-}" in
  "") MODE="web" ;;
  --help|-h) usage; exit 0 ;;
  --status) MODE="status" ;;
  --check) MODE="check" ;;
  --web) MODE="web" ;;
  *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
esac

if [[ ! -f pyproject.toml || ! -d tradingagents || ! -d cli ]]; then
  echo "ERROR: This does not appear to be the TradingAgents repository root: $SCRIPT_DIR" >&2
  exit 1
fi

PROJECT_NAME="$(python3 - <<'PY' 2>/dev/null
import tomllib
from pathlib import Path
print(tomllib.loads(Path('pyproject.toml').read_text()).get('project', {}).get('name', 'TradingAgents'))
PY
)"
PROJECT_NAME="${PROJECT_NAME:-TradingAgents}"
BRANCH="$(git branch --show-current 2>/dev/null || echo 'unknown')"
DATE_NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"

printf 'TradingAgents development environment\n'
printf 'Date: %s\nProject: %s\nBranch: %s\nRepository: %s\n' "$DATE_NOW" "$PROJECT_NAME" "$BRANCH" "$SCRIPT_DIR"

missing=0
warn=0

for tool in git bash python3; do
  if command -v "$tool" >/dev/null 2>&1; then
    printf 'OK  %s: %s\n' "$tool" "$(command -v "$tool")"
  else
    printf 'MISSING  %s\n' "$tool" >&2
    missing=1
  fi
done

PYTHON_CMD=""
if [[ -x .venv/bin/python ]]; then
  PYTHON_CMD=".venv/bin/python"
  printf 'OK  Python environment: .venv (%s)\n' "$(.venv/bin/python --version 2>&1)"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="$(command -v python3)"
  printf 'WARN  .venv not found; system Python available (%s)\n' "$(python3 --version 2>&1)"
  warn=1
else
  printf 'MISSING  Python environment and python3\n' >&2
  missing=1
fi

if [[ -f pyproject.toml ]]; then printf 'OK  pyproject.toml\n'; else printf 'MISSING  pyproject.toml\n'; missing=1; fi
for config in .env.example .env.enterprise.example; do
  [[ -f "$config" ]] && printf 'OK  %s\n' "$config" || printf 'WARN  %s missing\n' "$config"
done
if [[ -f .env ]]; then
  printf 'OK  .env present (values not displayed)\n'
else
  printf 'WARN  .env not present; optional API credentials and Docker env_file are not configured\n'
  warn=1
fi

if [[ "$MODE" != "status" ]]; then
  mkdir -p .local/data .local/logs .local/backups
  printf 'OK  Runtime directories: .local/data, .local/logs, .local/backups\n'
fi

if [[ "$MODE" == "status" || "$MODE" == "web" ]]; then
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 2 http://127.0.0.1:5173/ 2>/dev/null | grep -q '<title>TradingAgents Research Studio</title>'; then
    printf 'OK  Research Studio frontend: http://127.0.0.1:5173\n'
  else
    printf 'INFO  Research Studio frontend: not currently responding on port 5173\n'
  fi
fi

COMPOSE_FILE=""
for candidate in compose.yaml compose.yml docker-compose.yml docker-compose.yaml; do
  if [[ -f "$candidate" ]]; then COMPOSE_FILE="$candidate"; break; fi
done

if [[ -n "$COMPOSE_FILE" ]] && command -v docker >/dev/null 2>&1; then
  printf 'OK  Docker Compose file: %s\n' "$COMPOSE_FILE"
  if docker info >/dev/null 2>&1; then
    services="$(docker compose config --services 2>/dev/null | tr '\n' ' ')"
    printf 'OK  Compose services: %s\n' "${services:-none}"
    printf 'Service status:\n'
    docker compose ps --all 2>&1 | sed -n '1,30p'
    printf 'INFO  No Compose service is started automatically. The TradingAgents container is an application entrypoint and Ollama is optional. Start it explicitly only when needed.\n'
  else
    printf 'WARN  Docker is installed but the daemon is unavailable; skipping Compose status and startup\n'
    warn=1
  fi
elif [[ -n "$COMPOSE_FILE" ]]; then
  printf 'WARN  Compose file found but Docker is not installed; skipping Compose status and startup\n'
  warn=1
else
  printf 'INFO  No Docker Compose configuration detected\n'
fi

if [[ "$MODE" == "check" ]]; then
  printf 'INFO  Codespaces post-start check completed without starting jobs or services.\n'
fi

if [[ "$missing" -ne 0 ]]; then
  printf 'ERROR  Required tools or files are missing.\n' >&2
  exit 1
fi

if [[ "$warn" -ne 0 && "$MODE" == "check" ]]; then
  printf 'WARN  Optional configuration or services are unavailable; startup can continue.\n'
fi

if [[ "$MODE" == "web" ]]; then
  if ! command -v curl >/dev/null 2>&1; then
    printf 'ERROR  curl is required to safely check port 5173.\n' >&2
    exit 1
  fi
  if curl -fsS --max-time 2 http://127.0.0.1:5173/ 2>/dev/null | grep -q '<title>TradingAgents Research Studio</title>'; then
    printf 'INFO  Research Studio is already serving on port 5173.\n'
    printf 'INFO  Use the existing terminal process; no duplicate server was started.\n'
    printf 'INFO  Open the private Codespaces port labelled TradingAgents Research Studio.\n'
    exit 0
  fi
  if curl -sS -o /dev/null --max-time 2 http://127.0.0.1:5173/ 2>/dev/null; then
    printf 'ERROR  Port 5173 is occupied by a different service. Stop that service or configure it to use another port.\n' >&2
    exit 1
  fi
  if [[ ! -d web/node_modules ]]; then
    printf 'ERROR  Frontend dependencies are missing. Run once: cd web && pnpm install\n' >&2
    exit 1
  fi
  if ! command -v pnpm >/dev/null 2>&1; then
    printf 'ERROR  pnpm is not installed in this Codespace.\n' >&2
    exit 1
  fi

  printf 'Starting Research Studio in this terminal on 0.0.0.0:5173.\n'
  printf 'Keep this terminal open while using the website. Press Ctrl+C to stop the server.\n'
  printf 'Open the private Codespaces port labelled TradingAgents Research Studio.\n\n'
  pnpm --dir web dev 2>&1 | tee -a .local/logs/research-studio.log
  exit "$?"
fi

exit 0
