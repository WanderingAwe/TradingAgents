import { TERMINAL_SHORTCUTS } from '../keyboard/keyboard'

export function HelpPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="terminal-palette-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="terminal-help" role="dialog" aria-modal="true" aria-label="Terminal commands">
        <header><h2>Terminal commands</h2><button onClick={onClose}>ESC CLOSE</button></header>
        <section><h3>Keyboard</h3>{TERMINAL_SHORTCUTS.map((shortcut) => <div key={shortcut.id}><kbd>{shortcut.keys}</kbd><span>{shortcut.label}</span></div>)}</section>
        <section><h3>Commands</h3><div><kbd>HELP</kbd><span>Show this command list</span></div><div><kbd>OVERVIEW</kbd><span>Open overview</span></div><div><kbd>NEW RESEARCH</kbd><span>Open research form</span></div><div><kbd>RUNS</kbd><span>Open active runs</span></div><div><kbd>REPORTS</kbd><span>Open report library</span></div><div><kbd>DATA</kbd><span>Open data sources</span></div><div><kbd>MODELS</kbd><span>Open AI models</span></div><div><kbd>TELEGRAM</kbd><span>Open notification settings</span></div><div><kbd>HEALTH</kbd><span>Open system health</span></div><div><kbd>WORKSPACE</kbd><span>Open multi-panel workstation</span></div></section>
      </div>
    </div>
  )
}
