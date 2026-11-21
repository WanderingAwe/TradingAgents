import type { ParsedCommand } from './parser'

export interface TerminalCommandDefinition {
  command: string
  label: string
  description: string
  execute: (parsed: ParsedCommand) => void
}

export function createTerminalCommandRegistry(navigate: (path: string) => void) {
  const routes: Record<string, string> = {
    overview: '/',
    'new-research': '/research/new',
    'active-runs': '/runs',
    reports: '/reports',
    sources: '/sources',
    models: '/models',
    telegram: '/telegram',
    health: '/health',
    workspace: '/workspace',
  }

  return {
    execute(parsed: ParsedCommand) {
      if (parsed.type === 'navigate') navigate(routes[parsed.target])
    },
  }
}
