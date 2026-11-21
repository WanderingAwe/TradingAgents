export type JobStatus = 'Queued' | 'Running' | 'Completed' | 'Failed'
export type RunStage = 'Queued' | 'Market data' | 'Analyst team' | 'Research debate' | 'Risk review' | 'Report generation' | 'Completed'

export interface ResearchJob {
  id: string
  symbol: string
  company: string
  market: 'India' | 'Global'
  exchange: string
  analysisDate: string
  profile: 'Standard' | 'Deep'
  status: JobStatus
  stage: RunStage
  progress: number
  elapsed: string
  warnings: number
}

export interface ReportEvidence {
  id: string
  source: string
  published: string
  retrieved: string
  period: string
  summary: string
  status: 'Verified' | 'Illustrative' | 'Unavailable'
}

export interface ResearchReport {
  id: string
  symbol: string
  company: string
  market: 'India' | 'Global'
  exchange: string
  date: string
  status: 'Completed' | 'Review'
  rating: 'Buy' | 'Overweight' | 'Hold' | 'Underweight' | 'Sell'
  confidence: 'High' | 'Medium' | 'Low'
  evidence: ReportEvidence[]
}

export const demoJobs: ResearchJob[] = [
  { id: 'RS-2604', symbol: 'RELIANCE.NS', company: 'Reliance Industries', market: 'India', exchange: 'NSE', analysisDate: '2026-11-18', profile: 'Deep', status: 'Running', stage: 'Research debate', progress: 68, elapsed: '08m 24s', warnings: 1 },
  { id: 'RS-2603', symbol: 'INFY.NS', company: 'Infosys', market: 'India', exchange: 'NSE', analysisDate: '2026-11-18', profile: 'Standard', status: 'Running', stage: 'Analyst team', progress: 42, elapsed: '04m 51s', warnings: 0 },
  { id: 'RS-2602', symbol: 'AAPL', company: 'Apple', market: 'Global', exchange: 'NASDAQ', analysisDate: '2026-11-17', profile: 'Deep', status: 'Completed', stage: 'Completed', progress: 100, elapsed: '11m 08s', warnings: 0 },
  { id: 'RS-2601', symbol: 'TCS.NS', company: 'Tata Consultancy Services', market: 'India', exchange: 'NSE', analysisDate: '2026-11-16', profile: 'Standard', status: 'Failed', stage: 'Market data', progress: 24, elapsed: '02m 19s', warnings: 2 },
]

export const demoReports: ResearchReport[] = [
  { id: 'RP-2602', symbol: 'AAPL', company: 'Apple', market: 'Global', exchange: 'NASDAQ', date: '2026-11-17', status: 'Completed', rating: 'Overweight', confidence: 'Medium', evidence: [
    { id: 'EV-001', source: 'Illustrative market-price snapshot', published: '2026-11-17', retrieved: '2026-11-18 09:14 UTC', period: 'As of 2026-11-17', summary: 'Demonstration OHLCV sample used only to illustrate evidence linking.', status: 'Illustrative' },
    { id: 'EV-002', source: 'Illustrative filing summary', published: '2026-11-12', retrieved: '2026-11-18 09:15 UTC', period: 'Illustrative quarterly period', summary: 'Synthetic filing metadata demonstrates period versus publication-date separation.', status: 'Illustrative' },
  ] },
  { id: 'RP-2600', symbol: 'RELIANCE.NS', company: 'Reliance Industries', market: 'India', exchange: 'NSE', date: '2026-11-14', status: 'Review', rating: 'Hold', confidence: 'Low', evidence: [
    { id: 'EV-101', source: 'Illustrative NSE disclosure', published: '2026-11-13', retrieved: '2026-11-18 09:20 UTC', period: 'FY 2026', summary: 'Synthetic exchange announcement example with no live market claim.', status: 'Illustrative' },
  ] },
  { id: 'RP-2598', symbol: '0700.HK', company: 'Tencent', market: 'Global', exchange: 'HKEX', date: '2026-11-12', status: 'Completed', rating: 'Overweight', confidence: 'High', evidence: [
    { id: 'EV-201', source: 'Illustrative company filing', published: '2026-11-10', retrieved: '2026-11-18 09:21 UTC', period: 'Illustrative annual period', summary: 'Synthetic fundamentals reference used for report-layout demonstration.', status: 'Illustrative' },
  ] },
]

export const runStages: RunStage[] = ['Queued', 'Market data', 'Analyst team', 'Research debate', 'Risk review', 'Report generation', 'Completed']
