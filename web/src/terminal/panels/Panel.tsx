import type { ReactNode } from 'react'

export function Panel({ title, mnemonic, className = '', children }: { title: string; mnemonic?: string; className?: string; children: ReactNode }) {
  return (
    <section className={`terminal-panel ${className}`}>
      <header className="terminal-panel-header">
        {mnemonic && <span className="terminal-panel-mnemonic">{mnemonic}</span>}
        <h2>{title}</h2>
      </header>
      <div className="terminal-panel-body">{children}</div>
    </section>
  )
}

export function StatusIndicator({ label, tone = 'neutral' }: { label: string; tone?: 'positive' | 'negative' | 'neutral' | 'demo' }) {
  return <span className={`terminal-status terminal-status-${tone}`}><i />{label}</span>
}
