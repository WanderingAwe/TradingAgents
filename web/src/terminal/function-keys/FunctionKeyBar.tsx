import { useNavigate } from '@tanstack/react-router'
import { TERMINAL_MODULES } from '../registry/modules'

export function FunctionKeyBar({ onHelp }: { onHelp: () => void }) {
  const navigate = useNavigate()
  return (
    <footer className="terminal-function-bar" aria-label="Terminal function keys">
      {TERMINAL_MODULES.slice(0, 9).map((module) => (
        <button key={module.id} onClick={() => navigate({ to: module.path as never })}>
          <b>{module.functionKey}</b><span>{module.shortLabel}</span>
        </button>
      ))}
      <button className="terminal-function-help" onClick={onHelp}><b>HELP</b><span>COMMANDS</span></button>
      <div className="terminal-status-strip">
        <span>DATA: <b>DEMO</b></span>
        <span>RESEARCH ENGINE: <b>NOT CONNECTED</b></span>
        <span>API: <b>NOT CONNECTED</b></span>
        <span>ENV: <b>CODESPACES</b></span>
      </div>
    </footer>
  )
}
