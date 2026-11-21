export function TerminalLoading({ label = 'Loading data' }: { label?: string }) {
  return <div className="terminal-state" role="status"><span className="terminal-loading" />{label}</div>
}

export function TerminalEmpty({ title, detail }: { title: string; detail: string }) {
  return <div className="terminal-state"><strong>{title}</strong><span>{detail}</span></div>
}

export function TerminalWarning({ title, detail }: { title: string; detail: string }) {
  return <div className="terminal-warning" role="alert"><strong>{title}</strong><span>{detail}</span></div>
}
