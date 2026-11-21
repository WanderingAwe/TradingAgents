import { Link } from '@tanstack/react-router'
import { ArrowRight, Plus } from 'lucide-react'
import { demoJobs, demoReports } from '../data/demo'
import { PageHeader, StatusBadge } from '../components/ui'
import { Panel, StatusIndicator } from '../terminal/panels'

export function Overview() {
  const running = demoJobs.filter((job) => job.status === 'Running').length
  const failed = demoJobs.filter((job) => job.status === 'Failed').length

  return (
    <>
      <PageHeader eyebrow="OV  /  RESEARCH COMMAND CENTRE" title="Overview" description="Demo research workspace · India and global market context." action={<Link to="/research/new" className="button button-primary"><Plus size={14}/>NEW RESEARCH</Link>} />

      <div className="terminal-metrics" aria-label="Research summary metrics">
        <Panel mnemonic="OV1" title="ACTIVE RESEARCH"><strong>{running}</strong><span>SIMULATED JOBS</span></Panel>
        <Panel mnemonic="OV2" title="COMPLETED"><strong>{demoReports.length}</strong><span>DEMO REPORTS</span></Panel>
        <Panel mnemonic="OV3" title="FAILED"><strong>{failed}</strong><span>REVIEW REQUIRED</span></Panel>
        <Panel mnemonic="OV4" title="DATA MODE"><strong>DEMO</strong><span>NO LIVE SOURCES</span></Panel>
      </div>

      <div className="terminal-overview-grid">
        <Panel mnemonic="OV5" title="TRACKED DEMO INSTRUMENTS">
          <div className="terminal-watchlist">
            {[{ symbol: 'RELIANCE.NS', context: 'NSE · INDIA', value: '2,986.40', change: '-0.18%', tone: 'negative' }, { symbol: 'INFY.NS', context: 'NSE · INDIA', value: '1,482.20', change: '+0.64%', tone: 'positive' }, { symbol: 'AAPL', context: 'NASDAQ · GLOBAL', value: '224.18', change: '+0.21%', tone: 'positive' }].map((instrument) => (
              <div className="terminal-watchlist-row" key={instrument.symbol}><strong>{instrument.symbol}</strong><span>{instrument.context}</span><b>{instrument.value}</b><em className={`terminal-change-${instrument.tone}`}>{instrument.change}</em></div>
            ))}
          </div>
        </Panel>

        <Panel mnemonic="OV6" title="ACTIVE RESEARCH">
          <div className="terminal-run-list">
            {demoJobs.filter((job) => job.status === 'Running').map((job) => (
              <div className="terminal-run-row" key={job.id}><div><strong>{job.symbol}</strong><span>{job.stage}</span></div><div className="terminal-progress"><i style={{ width: `${job.progress}%` }} /></div><StatusIndicator label={job.status} tone="demo" /></div>
            ))}
          </div>
        </Panel>

        <Panel mnemonic="OV7" title="RECENT REPORTS">
          <div className="terminal-mini-table">
            {demoReports.slice(0, 3).map((report) => <Link key={report.id} to="/reports/$reportId" params={{ reportId: report.id }} className="terminal-mini-row"><strong>{report.symbol}</strong><span>{report.exchange}</span><b>{report.rating}</b><StatusBadge status={report.status} /></Link>) }
          </div>
        </Panel>

        <Panel mnemonic="OV8" title="SYSTEM / DATA STATUS">
          <div className="terminal-status-list">
            <div><span>FRONTEND</span><StatusIndicator label="ONLINE" tone="positive" /></div>
            <div><span>DATA SOURCES</span><StatusIndicator label="DEMO" tone="demo" /></div>
            <div><span>RESEARCH ENGINE</span><StatusIndicator label="NOT CONNECTED" tone="negative" /></div>
            <div><span>DATABASE</span><StatusIndicator label="NOT IMPLEMENTED" tone="neutral" /></div>
          </div>
          <Link className="terminal-panel-link" to="/health">OPEN HEALTH <ArrowRight size={12} /></Link>
        </Panel>
      </div>
    </>
  )
}
