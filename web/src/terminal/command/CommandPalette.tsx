import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { TERMINAL_MODULES } from '../registry/modules'
import { parseTerminalCommand } from './parser'
import { createTerminalCommandRegistry } from './registry'

export function CommandPalette({ open, onClose, initialQuery = '' }: { open: boolean; onClose: () => void; initialQuery?: string }) {
  const navigate = useNavigate()
  const registry = createTerminalCommandRegistry((path) => navigate({ to: path as never }))
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  if (!open) return null

  const commands = [
    { id: 'help', label: 'HELP', detail: 'Show available commands', keywords: 'help commands' },
    ...TERMINAL_MODULES.map((module) => ({ id: module.id, label: module.label.toUpperCase(), detail: `${module.mnemonic} · ${module.path}`, keywords: `${module.label} ${module.shortLabel} ${module.mnemonic}` })),
  ].filter((command) => `${command.label} ${command.detail} ${command.keywords}`.toLowerCase().includes(query.toLowerCase()))

  const execute = (label: string) => {
    registry.execute(parseTerminalCommand(label))
    onClose()
  }

  return (
    <div className="terminal-palette-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="terminal-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="terminal-palette-input"><span>&gt;</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
          if (event.key === 'Escape') onClose()
          if (event.key === 'Enter') {
            const parsed = parseTerminalCommand(query)
            if (parsed.type === 'help') onClose()
            else registry.execute(parsed)
            if (parsed.type !== 'help') onClose()
          }
        }} placeholder="Type HELP or a module name" /></div>
        <div className="terminal-palette-results">
          {commands.map((command) => (
            <button key={command.id} onClick={() => execute(command.id === 'help' ? 'HELP' : command.label)}>
              <strong>{command.label}</strong><span>{command.detail}</span>
            </button>
          ))}
          {commands.length === 0 && <div className="terminal-palette-empty">UNKNOWN COMMAND · TRY HELP</div>}
        </div>
      </div>
    </div>
  )
}
