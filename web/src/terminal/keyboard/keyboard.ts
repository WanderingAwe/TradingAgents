export interface TerminalShortcut {
  id: string
  keys: string
  label: string
  match: (event: KeyboardEvent) => boolean
}

export const isTypingTarget = (target: EventTarget | null) => {
  if (!target || typeof target !== 'object') return false
  const element = target as { tagName?: string; isContentEditable?: boolean }
  const tagName = element.tagName?.toUpperCase()
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || element.isContentEditable === true
}

export const TERMINAL_SHORTCUTS: TerminalShortcut[] = [
  { id: 'palette', keys: 'Ctrl K', label: 'Open command palette', match: (event) => (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' },
  { id: 'command', keys: '/', label: 'Focus command bar', match: (event) => event.key === '/' },
  { id: 'escape', keys: 'Esc', label: 'Close palette or clear command', match: (event) => event.key === 'Escape' },
]
