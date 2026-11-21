import { demoJobs, type ResearchJob, type RunStage } from '../data/demo'

let jobs = [...demoJobs]

export function getJobs(): ResearchJob[] {
  return jobs
}

export function submitDemoResearch(input: {
  market: 'India' | 'Global'
  exchange: string
  symbol: string
  analysisDate: string
  profile: 'Standard' | 'Deep'
  analysts: string[]
}): ResearchJob {
  const job: ResearchJob = {
    id: `RS-${Math.floor(2700 + Math.random() * 700)}`,
    symbol: input.symbol.trim().toUpperCase(),
    company: input.symbol.trim().toUpperCase(),
    market: input.market,
    exchange: input.exchange,
    analysisDate: input.analysisDate,
    profile: input.profile,
    status: 'Queued',
    stage: 'Queued',
    progress: 4,
    elapsed: '00m 00s',
    warnings: 0,
  }
  jobs = [job, ...jobs]
  return job
}

export function advanceDemoJobs(): ResearchJob[] {
  const stages: RunStage[] = ['Queued', 'Market data', 'Analyst team', 'Research debate', 'Risk review', 'Report generation', 'Completed']
  jobs = jobs.map((job) => {
    if (job.status !== 'Running' && job.status !== 'Queued') return job
    const current = stages.indexOf(job.stage)
    const next = Math.min(current + 1, stages.length - 1)
    return {
      ...job,
      status: next === stages.length - 1 ? 'Completed' : 'Running',
      stage: stages[next],
      progress: next === stages.length - 1 ? 100 : Math.min(92, job.progress + 14),
    }
  })
  return jobs
}
