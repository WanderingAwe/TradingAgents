import { useEffect, useState, type ReactNode } from 'react'
import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme } from '../lib/theme'
import { TERMINAL_MODULES } from '../terminal/registry/modules'
import { TickerStrip } from '../terminal/ticker/TickerStrip'
import { CommandPalette } from '../terminal/command/CommandPalette'
import { HelpPanel } from '../terminal/shell/HelpPanel'
import { FunctionKeyBar } from '../terminal/function-keys/FunctionKeyBar'
import { isTypingTarget } from '../terminal/keyboard/keyboard'

export function Layout({ children }: { children?: ReactNode }) {
  const [theme, updateTheme] = useState(getTheme())
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [command, setCommand] = useState('')
  const navigate = useNavigate()

  useEffect(() => setTheme(theme), [theme])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      } else if (event.key === '/') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('#terminal-command-input')?.focus()
      } else if (event.key === 'Escape') {
        setPaletteOpen(false)
        setHelpOpen(false)
        setCommand('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = () => updateTheme(theme === 'dark' ? 'light' : 'dark')

  const submitCommand = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = command.trim().toLowerCase()
    if (normalized === 'help' || normalized === '?') {
      setHelpOpen(true)
      setCommand('')
      return
    }
    const module = TERMINAL_MODULES.find((item) =>
      normalized === item.id || normalized === item.mnemonic.toLowerCase() || normalized === item.shortLabel.toLowerCase() || normalized === item.label.toLowerCase()
    )
    if (module) navigate({ to: module.path as never })
    setCommand('')
  }

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">TA</div>
          <div><strong>TradingAgents</strong><span>Research Terminal</span></div>
        </div>
        <nav aria-label="Primary terminal navigation">
          {TERMINAL_MODULES.map((module) => (
            <Link key={module.id} to={module.path} className="nav-item" activeOptions={{ exact: module.path === '/' }} onClick={() => setMenuOpen(false)}>
              <module.icon size={14} /><span>{module.shortLabel}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">MENU</button>
          <div className="topbar-context">
            <div className="product-name">TRADINGAGENTS RESEARCH TERMINAL</div>
            <div className="market-context">REGION: INDIA / GLOBAL</div>
          </div>
          <div className="top-actions">
            <span className="top-status"><i />DATA DEMO</span>
            <span className="demo-badge">DEMO MODE</span>
            <button className="icon-button" onClick={toggleTheme} aria-label="Switch theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        <div className="terminal-command-row">
          <form onSubmit={submitCommand}><label htmlFor="terminal-command-input"><span>&gt;</span><input id="terminal-command-input" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="ENTER HELP OR MODULE COMMAND" /><kbd>CTRL K · / · ESC</kbd></label></form>
        </div>
        <TickerStrip />

        <main>{children ?? <Outlet />}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
      <FunctionKeyBar onHelp={() => setHelpOpen(true)} />
    </div>
  )
}
