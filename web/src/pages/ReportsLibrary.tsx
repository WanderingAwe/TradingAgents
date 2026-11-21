import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Download, Search } from 'lucide-react'
import { demoReports } from '../data/demo'
import { downloadDemoReport } from '../services/reportService'
import { Card, PageHeader, StatusBadge } from '../components/ui'

export function ReportsLibrary() {
  const [search, setSearch] = useState('')
  const [market, setMarket] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState<'date' | 'symbol'>('date')

  const reports = useMemo(() => demoReports.filter((report) => {
    const matchesSearch = `${report.symbol} ${report.company}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (market === 'All' || report.market === market) && (status === 'All' || report.status === status)
  }).sort((a, b) => sort === 'date' ? b.date.localeCompare(a.date) : a.symbol.localeCompare(b.symbol)), [search, market, status, sort])

  return <>
    <PageHeader eyebrow="Research library" title="Reports" description="Search and open illustrative research reports." />
    <Card>
      <div className="filter-bar">
        <label className="search-field"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search symbol or company" /></label>
        <select value={market} onChange={(event) => setMarket(event.target.value)}><option>All</option><option>India</option><option>Global</option></select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Completed</option><option>Review</option></select>
        <select value={sort} onChange={(event) => setSort(event.target.value as 'date' | 'symbol')}><option value="date">Newest date</option><option value="symbol">Symbol</option></select>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Report</th><th>Market</th><th>Analysis date</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {reports.map((report) => <tr key={report.id}><td><strong>{report.symbol}</strong><small>{report.company}</small></td><td>{report.exchange}</td><td>{report.date}</td><td><span className={`rating rating-${report.rating.toLowerCase()}`}>{report.rating}</span></td><td><StatusBadge status={report.status}/></td><td><div className="row-actions"><Link className="table-action" to="/reports/$reportId" params={{ reportId: report.id }}>Open</Link><button className="icon-button" aria-label="Download demo report" onClick={() => downloadDemoReport(report)}><Download size={15}/></button></div></td></tr>)}
        {reports.length === 0 && <tr><td colSpan={6}><div className="empty-state"><strong>No reports found</strong><span>Change the search or filters to broaden the library.</span></div></td></tr>}
      </tbody></table></div>
    </Card>
  </>
}
