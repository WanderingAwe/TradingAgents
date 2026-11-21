import { demoReports, type ResearchReport } from '../data/demo'

export function getReports(): ResearchReport[] {
  return demoReports
}

export function getReport(id: string): ResearchReport | undefined {
  return demoReports.find((report) => report.id === id)
}

export function downloadDemoReport(report: ResearchReport): void {
  const markdown = `# ${report.company} (${report.symbol})\n\nDEMO MODE - Illustrative financial research only.\n\nRating: ${report.rating}\nConfidence: ${report.confidence}\nAnalysis date: ${report.date}\n\n## Evidence\n${report.evidence.map((item) => `- ${item.id}: ${item.summary}`).join('\n')}\n`
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${report.symbol}-demo-report.md`
  anchor.click()
  URL.revokeObjectURL(url)
}
