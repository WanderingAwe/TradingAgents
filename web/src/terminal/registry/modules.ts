import type { LucideIcon } from 'lucide-react'
import { Activity, BarChart3, Database, FileText, HeartPulse, LayoutDashboard, PanelsTopLeft, PlaySquare, Send } from 'lucide-react'

export type TerminalModuleGroup = 'Research' | 'Library' | 'Operations'

export interface TerminalModule {
  id: string
  label: string
  shortLabel: string
  mnemonic: string
  functionKey: string
  path: string
  group: TerminalModuleGroup
  icon: LucideIcon
}

export const TERMINAL_MODULES: TerminalModule[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'OVERVIEW', mnemonic: 'OV', functionKey: 'F1', path: '/', group: 'Research', icon: LayoutDashboard },
  { id: 'new-research', label: 'New Research', shortLabel: 'NEW', mnemonic: 'NR', functionKey: 'F2', path: '/research/new', group: 'Research', icon: PlaySquare },
  { id: 'active-runs', label: 'Active Runs', shortLabel: 'RUNS', mnemonic: 'AR', functionKey: 'F3', path: '/runs', group: 'Research', icon: Activity },
  { id: 'reports', label: 'Reports Library', shortLabel: 'REPORTS', mnemonic: 'RP', functionKey: 'F4', path: '/reports', group: 'Library', icon: FileText },
  { id: 'sources', label: 'Data Sources', shortLabel: 'DATA', mnemonic: 'DS', functionKey: 'F5', path: '/sources', group: 'Library', icon: Database },
  { id: 'models', label: 'AI Models', shortLabel: 'MODELS', mnemonic: 'AI', functionKey: 'F6', path: '/models', group: 'Operations', icon: BarChart3 },
  { id: 'telegram', label: 'Telegram Notifications', shortLabel: 'NOTIFY', mnemonic: 'TG', functionKey: 'F7', path: '/telegram', group: 'Operations', icon: Send },
  { id: 'health', label: 'System Health', shortLabel: 'HEALTH', mnemonic: 'SY', functionKey: 'F8', path: '/health', group: 'Operations', icon: HeartPulse },
  { id: 'workspace', label: 'Multi-Panel Workstation', shortLabel: 'WORKSPACE', mnemonic: 'WS', functionKey: 'F9', path: '/workspace', group: 'Research', icon: PanelsTopLeft },
]

export function findTerminalModule(pathname: string): TerminalModule | undefined {
  return TERMINAL_MODULES
    .filter((module) => module.path === '/' ? pathname === '/' : pathname.startsWith(module.path))
    .sort((left, right) => right.path.length - left.path.length)[0]
}
