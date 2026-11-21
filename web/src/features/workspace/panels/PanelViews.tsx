import { Link } from '@tanstack/react-router'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { IDockviewPanelProps } from 'dockview-react'
import { demoJobs, demoReports } from '../../../data/demo'
import { Panel, StatusIndicator } from '../../../terminal/panels'

const illustrativeSeries = [
  { session: '09:30', value: 100 },
  { session: '10:00', value: 101.2 },
  { session: '10:30', value: 99.8 },
  { session: '11:00', value: 102.1 },
  { session: '11:30', value: 101.4 },
  { session: '12:00', value: 103 },
  { session: '12:30', value: 102.6 },
]

export function WatchlistPanel() {
  const instruments = [...demoJobs.map((job) => ({ symbol: job.symbol, company: job.company, market: job.market })), ...demoReports.map((report) => ({ symbol: report.symbol, company: report.company, market: report.market }))]
  const unique = [...new Map(instruments.map((item) => [item.symbol, item])).values()]
  return <Panel title="Tracked instruments · demo" mnemonic="WL"><div className="workstation-table"><div className="workstation-row workstation-row-head"><span>SYMBOL</span><span>COMPANY</span><span>MARKET</span></div>{unique.map((item) => <div className="workstation-row" key={item.symbol}><strong>{item.symbol}</strong><span>{item.company}</span><small>{item.market}</small></div>)}</div></Panel>
}

export function ChartPanel({ params }: IDockviewPanelProps) {
  const symbol = typeof params.symbol === 'string' ? params.symbol : 'DEMO SERIES'
  return <Panel title={`${symbol} · illustrative`} mnemonic="CH"><div className="workstation-chart-label"><StatusIndicator label="DEMO SERIES · NOT LIVE" tone="demo" /><span>INDEXED VALUE · SYNTHETIC</span></div><div className="workstation-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={illustrativeSeries} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}><CartesianGrid stroke="var(--terminal-line)" strokeDasharray="2 3"/><XAxis dataKey="session" tick={{ fill: 'var(--terminal-muted)', fontSize: 9 }} axisLine={{ stroke: 'var(--terminal-line)' }} tickLine={false}/><YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: 'var(--terminal-muted)', fontSize: 9 }} axisLine={false} tickLine={false} width={34}/><Tooltip contentStyle={{ background: 'var(--terminal-panel)', border: '1px solid var(--terminal-line)', fontSize: 10 }} labelStyle={{ color: 'var(--terminal-muted)' }}/><Line type="monotone" dataKey="value" stroke="var(--terminal-amber-bright)" strokeWidth={1.5} dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div></Panel>
}

export function ResearchActivityPanel() {
  return <Panel title="Research activity · demo" mnemonic="RA"><div className="workstation-table"><div className="workstation-row workstation-row-head"><span>JOB</span><span>STAGE</span><span>STATUS</span></div>{demoJobs.map((job) => <div className="workstation-row" key={job.id}><strong>{job.symbol}</strong><span>{job.stage}</span><StatusIndicator label={job.status.toUpperCase()} tone={job.status === 'Failed' ? 'negative' : job.status === 'Completed' ? 'positive' : 'demo'}/></div>)}</div></Panel>
}

export function ReportsPanel() {
  return <Panel title="Research reports · demo" mnemonic="RP"><div className="workstation-table"><div className="workstation-row workstation-row-head"><span>REPORT</span><span>DATE</span><span>RATING</span></div>{demoReports.map((report) => <div className="workstation-row" key={report.id}><Link to="/reports/$reportId" params={{ reportId: report.id }}><strong>{report.symbol}</strong><small>{report.id}</small></Link><span>{report.date}</span><StatusIndicator label={report.status.toUpperCase()} tone={report.status === 'Completed' ? 'positive' : 'demo'}/></div>)}</div></Panel>
}
