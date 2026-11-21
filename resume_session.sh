#!/usr/bin/env bash
set -u

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

sanitize() {
  sed -E \
    -e 's/(OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|AZURE_OPENAI_API_KEY|XAI_API_KEY|DEEPSEEK_API_KEY|DASHSCOPE(_CN)?_API_KEY|ZHIPU(_CN)?_API_KEY|MINIMAX(_CN)?_API_KEY|OPENROUTER_API_KEY|MISTRAL_API_KEY|MOONSHOT_API_KEY|GROQ_API_KEY|NVIDIA_API_KEY|OPENAI_COMPATIBLE_API_KEY|FRED_API_KEY|ALPHA_VANTAGE_API_KEY|TYPESAFE_API_KEY)([=:])[[:space:]]*[^[:space:],;]+/\1\3<redacted>/Ig' \
    -e 's/(Authorization:?[[:space:]]*(Bearer[[:space:]]*)?)[A-Za-z0-9._~+\/=-]+/\1<redacted>/Ig' \
    -e 's/(gh[pousr]_[A-Za-z0-9_]+)/<redacted>/g' \
    -e 's/(password|passwd|secret|token|api[_-]?key)([=:])[[:space:]]*[^[:space:],;]+/\1\2<redacted>/Ig'
}

printf '== Project handover ==\n'
if [[ -f docs/PROJECT_STATE.md ]]; then
  sed -n '1,220p' docs/PROJECT_STATE.md
else
  echo 'No docs/PROJECT_STATE.md exists yet.'
fi

printf '\n== Most recent session entry ==\n'
if [[ -f docs/SESSION_LOG.md ]]; then
  awk '
    /^## Session / { if (block != "") block=""; block=$0 "\n"; capture=1; next }
    capture { block=block $0 "\n" }
    END { if (capture) printf "%s", block }
  ' docs/SESSION_LOG.md
else
  echo 'No session log exists yet.'
fi

printf '\n== Git state ==\n'
printf 'Branch: %s\n' "$(git branch --show-current 2>/dev/null || echo unknown)"
if git status --short --branch >/dev/null 2>&1; then
  git status --short --branch
else
  echo 'Git status unavailable.'
fi

printf '\n== Docker services ==\n'
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && [[ -f docker-compose.yml || -f compose.yml || -f compose.yaml ]]; then
  docker compose ps --all 2>&1 | sed -n '1,30p'
else
  echo 'Docker Compose services are not configured or the Docker daemon is unavailable.'
fi

printf '\n== Recommended next task ==\n'
if [[ -f docs/PROJECT_STATE.md ]]; then
  grep -n '^Recommended next action:\|^\*\*Recommended next action:' docs/PROJECT_STATE.md | sed -n '1p' || echo 'See the Active task and Pending tasks sections in docs/PROJECT_STATE.md.'
fi

printf '\n== Recent application log locations ==\n'
found_log=0
while IFS= read -r log; do
  [[ -n "$log" ]] || continue
  found_log=1
  printf '  %s\n' "$log"
  tail -n 12 "$log" 2>/dev/null | sanitize | sed '1,12s/^/    /'
done < <(find .local/logs "$HOME/.tradingagents/logs" results -type f \( -name '*.log' -o -name 'message_tool.log' \) 2>/dev/null | sort | tail -n 8)
if [[ "$found_log" -eq 0 ]]; then
  echo '  No recent application logs found.'
fi

printf '\nThis restores files and saved context, not exact previous process memory or running processes.\n'
