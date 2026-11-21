import { useParams } from '@tanstack/react-router'
import { ArrowLeft, Download, Link as LinkIcon, ShieldAlert } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getReport, downloadDemoReport } from '../services/reportService'
import { Card, PageHeader, StatusBadge } from '../components/ui'

const sections = [
  ['Executive summary', 'This illustrative report demonstrates the research presentation structure. It contains no real market conclusion or investment recommendation.'],
  ['Company overview', 'The company profile would summarize business lines, operating footprint and exchange identity in a live implementation.'],
  ['Fundamental analysis', 'Illustrative fundamentals should be separated from reporting periods and filing publication dates.'],
  ['Financial analysis', 'No real financial values are shown in this demo. Values must come from verified and dated sources.'],
  ['Technical analysis', 'A live implementation would show point-in-time OHLCV and clearly marked technical indicators.'],
  ['News and sentiment', 'News publication dates, social screening and unavailable sources should remain independently visible.'],
  ['Bullish arguments', 'Illustrative evidence strength, catalysts and data dependencies would appear in this section.'],
  ['Bearish arguments', 'Illustrative downside cases and contradictory evidence would appear in this section.'],
  ['Risk assessment', 'Liquidity, governance, volatility and market-specific risks require separate verified evidence.'],
]

export function ReportDetail() {
  const { reportId } = useParams({ strict: false }) as { reportId: string }
  const report = getReport(reportId)
  if (!report) return <Card><div className="empty-state"><strong>Report unavailable</strong><span>The demonstration report could not be found.</span></div></Card>

  return <>
    <Link className="back-link" to="/reports"><ArrowLeft size={15}/>Reports library</Link>
    <PageHeader eyebrow={`${report.exchange} · ${report.id}`} title={`${report.company}`} description="Illustrative research report · not investment advice" action={<button className="button button-secondary" onClick={() => downloadDemoReport(report)}><Download size={16}/>Download demo</button>} />
    <div className="demo-disclaimer"><ShieldAlert size={17}/><div><strong>Demonstration data</strong><span>All findings, evidence and metrics on this page are illustrative and must not be treated as real financial information.</span></div></div>
    <div className="report-layout">
      <article className="report-document">
        <div className="report-summary"><div><span>Research rating</span><strong className={`rating rating-${report.rating.toLowerCase()}`}>{report.rating}</strong></div><div><span>Confidence</span><strong>{report.confidence}</strong></div><div><span>Analysis date</span><strong>{report.date}</strong></div></div>
        {sections.map(([title, text]) => <section id={title.toLowerCase().replace(/ /g, '-')} className="report-section" key={title}><h2>{title}</h2><p>{text}</p>{title === 'Financial analysis' && <div className="evidence-callout"><LinkIcon size={14}/><span>Evidence IDs</span>{report.evidence.map((item) => <a href={`#${item.id}`} key={item.id}>{item.id}</a>)}</div>}</section>)}
      </article>
      <aside className="evidence-panel"><div className="evidence-header"><span className="eyebrow">References</span><h2>Evidence appendix</h2></div>
        {report.evidence.map((item) => <div className="evidence-card" id={item.id} key={item.id}><div><strong>{item.id}</strong><StatusBadge status={item.status}/></div><h3>{item.source}</h3><p>{item.summary}</p><dl><div><dt>Period</dt><dd>{item.period}</dd></div><div><dt>Published</dt><dd>{item.published}</dd></div><div><dt>Retrieved</dt><dd>{item.retrieved}</dd></div></dl></div>)}
        <div className="limitations"><strong>Limitations</strong><p>Demo sources and values are synthetic. Live filing, exchange and news provenance is not yet integrated.</p></div>
      </aside>
    </div>
  </>
}
