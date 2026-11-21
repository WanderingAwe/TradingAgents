export type ParsedCommand =
  | { type: 'help' }
  | { type: 'navigate'; target: 'overview' | 'new-research' | 'active-runs' | 'reports' | 'sources' | 'models' | 'telegram' | 'health' | 'workspace' }
  | { type: 'clear' }
  | { type: 'unknown'; input: string }

export function parseTerminalCommand(input: string): ParsedCommand {
  const normalized = input.trim().toLowerCase().replace(/^\/+/, '')
  if (!normalized) return { type: 'clear' }
  if (normalized === 'help' || normalized === '?') return { type: 'help' }

  const routes: Record<string, ParsedCommand> = {
    overview: { type: 'navigate', target: 'overview' },
    home: { type: 'navigate', target: 'overview' },
    new: { type: 'navigate', target: 'new-research' },
    'new research': { type: 'navigate', target: 'new-research' },
    research: { type: 'navigate', target: 'new-research' },
    runs: { type: 'navigate', target: 'active-runs' },
    active: { type: 'navigate', target: 'active-runs' },
    reports: { type: 'navigate', target: 'reports' },
    library: { type: 'navigate', target: 'reports' },
    data: { type: 'navigate', target: 'sources' },
    sources: { type: 'navigate', target: 'sources' },
    models: { type: 'navigate', target: 'models' },
    ai: { type: 'navigate', target: 'models' },
    telegram: { type: 'navigate', target: 'telegram' },
    notify: { type: 'navigate', target: 'telegram' },
    health: { type: 'navigate', target: 'health' },
    system: { type: 'navigate', target: 'health' },
    workspace: { type: 'navigate', target: 'workspace' },
    ws: { type: 'navigate', target: 'workspace' },
  }

  return routes[normalized] ?? { type: 'unknown', input }
}
