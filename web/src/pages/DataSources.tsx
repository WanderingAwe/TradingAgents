import { Database, Newspaper, Building2, Landmark } from 'lucide-react'
import { Card, PageHeader, StatusBadge } from '../components/ui'

const sources = [
  { name: 'Market prices', icon: Database, status: 'Demo', detail: 'Illustrative OHLCV and indices', coverage: 'NSE, BSE, global exchanges' },
  { name: 'Company fundamentals', icon: Building2, status: 'Not connected', detail: 'No live filing or statement adapter', coverage: 'Yahoo and future India provider' },
  { name: 'Exchange announcements', icon: Landmark, status: 'Not connected', detail: 'No NSE/BSE announcement feed', coverage: 'Corporate actions and disclosures' },
  { name: 'News', icon: Newspaper, status: 'Not connected', detail: 'No live publication feed', coverage: 'Company and macro headlines' },
]

export function DataSources() {
  return <><PageHeader eyebrow="Provider operations" title="Data sources" description="Demonstration provider status and intended coverage."/><div className="provider-grid">{sources.map(({ name, icon: Icon, status, detail, coverage }) => <Card key={name} className="provider-card"><div className="provider-head"><div className="provider-icon"><Icon size={20}/></div><StatusBadge status={status}/></div><h2>{name}</h2><p>{detail}</p><dl><div><dt>Coverage</dt><dd>{coverage}</dd></div><div><dt>Freshness</dt><dd>{status === 'Demo' ? 'Illustrative snapshot' : 'No connection'}</dd></div></dl></Card>)}</div></>
}
