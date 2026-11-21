import { useEffect, useState } from 'react'
import { Clock3, TriangleAlert } from 'lucide-react'
import { advanceDemoJobs, getJobs } from '../services/researchService'
import { runStages, type ResearchJob } from '../data/demo'
import { Card, PageHeader, StatusBadge } from '../components/ui'

export function ActiveRuns() {
  const [jobs, setJobs] = useState(getJobs)

  useEffect(() => {
    const timer = window.setInterval(() => setJobs([...advanceDemoJobs()]), 8000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <PageHeader eyebrow="Execution monitor" title="Active runs" description="Demonstration lifecycle updates every few seconds." />
      <div className="runs-layout">
        {jobs.map((job) => <RunCard key={job.id} job={job}/>) }
      </div>
    </>
  )
}

function RunCard({ job }: { job: ResearchJob }) {
  const stageIndex = runStages.indexOf(job.stage)
  return <Card className="run-card"><div className="run-card-head"><div><span className="job-id">{job.id}</span><h2>{job.symbol}</h2><p>{job.company} · {job.market} · {job.exchange}</p></div><StatusBadge status={job.status}/></div>
    <div className="run-meta"><span><Clock3 size={14}/>{job.elapsed}</span><span>{job.analysisDate}</span><span>{job.profile}</span></div>
    {job.warnings > 0 && <div className="warning"><TriangleAlert size={15}/>{job.warnings} demonstration warning{job.warnings > 1 ? 's' : ''}</div>}
    <div className="stage-progress"><div className="stage-copy"><span>Current stage</span><strong>{job.stage}</strong></div><div className="progress-track"><i style={{ width: `${job.progress}%` }}/></div></div>
    <div className="timeline">{runStages.map((stage, index) => <div key={stage} className={index < stageIndex ? 'done' : index === stageIndex ? 'current' : ''}><i/><span>{stage}</span></div>)}</div>
  </Card>
}
