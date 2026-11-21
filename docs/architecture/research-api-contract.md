# Research API Contract — PROPOSED (NOT IMPLEMENTED)

> **Status: PROPOSED — NOT IMPLEMENTED.**
>
> This document describes a proposed, future HTTP API contract for research job
> submission, job status polling, and research report retrieval. It is **not**
> implemented by the Phase 1.8 backend foundation. No research endpoints, fake
> job records, dummy workers, or pretend research execution exist in this
> repository as of this writing.

The actual research execution capability remains a future phase. The TradingAgents
LangGraph research engine (`tradingagents/`) is not duplicated, wrapped, or
modified for this contract in Phase 1.8.

## Base path

All routes are versioned under the API prefix:

```
/api/v1
```

## Endpoints

### A. Research job submission

```
POST /api/v1/research/jobs
```

**Status: PROPOSED — NOT IMPLEMENTED.**

**Purpose:** Submit a new research job.

**Request body (proposed):**

```json
{
  "ticker": "NVDA",
  "analysis_date": "2026-09-23",
  "analysts": ["market", "news", "fundamentals"],
  "research_depth": 2,
  "portfolio": null
}
```

**Response (proposed):**

- `201 Created` — job accepted and queued.

```json
{
  "job_id": "job_abc123...",
  "status": "queued",
  "created_at": "2026-11-21T06:00:00Z"
}
```

- `202 Accepted` — accepted for background processing.

**Errors:**

- `400 Bad Request` — invalid submission payload.
- `409 Conflict` — duplicate job already exists for the same ticker/date.

### B. Job status

```
GET /api/v1/research/jobs/{job_id}
```

**Status: PROPOSED — NOT IMPLEMENTED.**

**Response (proposed):**

```json
{
  "job_id": "job_abc123...",
  "status": "queued" | "running" | "completed" | "failed",
  "created_at": "2026-11-21T06:00:00Z",
  "updated_at": "2026-11-21T06:00:05Z",
  "started_at": null,
  "finished_at": null,
  "report_id": null
}
```

**Statuses:** `queued`, `running`, `completed`, `failed`.

### C. Report retrieval

```
GET /api/v1/reports/{report_id}
```

**Status: PROPOSED — NOT IMPLEMENTED.**

**Response (proposed):**

```json
{
  "report_id": "report_xyz789...",
  "job_id": "job_abc123...",
  "ticker": "NVDA",
  "analysis_date": "2026-09-23",
  "content": "<markdown/html report content>",
  "created_at": "..."
}
```

## Job lifecycle

```
queued -> running -> completed
              \-> failed
```

- A job must not be reported as started when it has not been started.
- No job may remain permanently queued without a worker integration.
- No fake worker or background execution exists in Phase 1.8.

## Error response format

All research endpoints should use the established structured error envelope:

```json
{
  "error": "string",
  "message": "string",
  "status_code": 400,
  "request_id": "string",
  "details": []
}
```

## Future integration requirements

- A research worker will submit jobs to the TradingAgents engine.
- Successful jobs reference reports by `report_id`.
- Authentication and authorization are required before exposing private research data.
- Idempotency for job submission is proposed but not implemented.

## Out of scope for Phase 1.8

- Live research execution.
- Job queue infrastructure.
- Background worker.
- Report persistence beyond future design.
