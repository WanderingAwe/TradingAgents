import type { ReactNode } from 'react'

export function MetricRow({ children }: { children: ReactNode }) {
  return <div className="terminal-metric-row">{children}</div>
}
