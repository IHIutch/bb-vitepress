---
title: /jobs Endpoint
description: Check export job status, list past jobs, and cancel active jobs.
---

# /jobs

Manage export jobs: check status, list past jobs, download completed data, and cancel active jobs.

## Check job status

After starting an export, poll the job URL to check progress.

### Request

```
GET /api/v2/jobs/{job_id}
```

### Headers

```yaml
Authorization: Bearer {token}
Accept: application/fhir+json
```

### Example

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/jobs/{job_id}" \
    -H "Accept: application/fhir+json" \
    -H "Authorization: Bearer {token}" \
    -i
```

### Response: 202 — in progress

The `X-Progress` header shows estimated completion:

```
X-Progress: In Progress, 80%
```

### Response: 200 — complete

The response body lists download URLs for each resource type:

```json
{
  "transactionTime": "2024-12-09T20:44:01.705398Z",
  "request": "https://sandbox.bcda.cms.gov/api/v2/Group/all/$export",
  "requiresAccessToken": true,
  "output": [
    {
      "type": "ExplanationOfBenefit",
      "url": "https://sandbox.bcda.cms.gov/data/42/afd22dfa-c239-4063-8882-eb2712f9f638.ndjson"
    },
    {
      "type": "Coverage",
      "url": "https://sandbox.bcda.cms.gov/data/42/f76a0b76-48ed-4033-aad9-d3eec37e7e83.ndjson"
    },
    {
      "type": "Patient",
      "url": "https://sandbox.bcda.cms.gov/data/42/f92dcf16-63a2-448e-a12a-3bf677f966ed.ndjson"
    }
  ],
  "error": [],
  "JobID": 42
}
```

### Downloading data

GET each URL from the `output` array. Include `Accept-Encoding: gzip` for compressed downloads.

```shell
curl -X GET "https://sandbox.bcda.cms.gov/data/{job_id}/{file_name}" \
    -H "Accept-Encoding: gzip" \
    -H "Authorization: Bearer {token}"
```

::: warning Files expire after 24 hours
Download files within 24 hours. You can use a new bearer token if your original expires. After 24 hours, restart the job.
:::

If errors occurred during export, the `error` array contains URLs to NDJSON files with [FHIR OperationOutcome](https://www.hl7.org/fhir/operationoutcome.html) resources describing the issues.

## List past jobs

Retrieve details on all past export jobs for your organization.

### Request

```
GET /api/v2/jobs
```

### Filter by status

Use the `_status` parameter to filter by end state:

```
GET /api/v2/jobs?_status=Archived
```

**Job states and their response values:**

| Internal states | Response status |
|---|---|
| Archived, Expired, Completed | `completed` |
| FailedExpired, Failed | `failed` |
| Pending, In Progress | `in-progress` |
| CancelledExpired, Cancelled | `cancelled` |

### Example

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/jobs" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

### Response

A FHIR Bundle of Task resources. Each entry represents one past job:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 1,
  "entry": [
    {
      "resource": {
        "resourceType": "Task",
        "status": "completed",
        "identifier": [
          {
            "system": "https://bcda.cms.gov/api/v2/jobs",
            "use": "official",
            "value": "1"
          }
        ],
        "intent": "order",
        "executionPeriod": {
          "start": "2021-08-13T00:07:48+00:00",
          "end": "2021-08-14T00:07:48+00:00"
        },
        "input": [
          {
            "type": { "text": "BULK FHIR Export" },
            "valueString": "GET https://bcda.cms.gov/api/v2/Group/all/$export"
          }
        ]
      }
    }
  ]
}
```

If your organization has no jobs, you'll receive a `404` response.

## Cancel a job

Cancel any active export job.

### Request

```
DELETE /api/v2/jobs/{job_id}
```

### Example

```shell
curl -X DELETE "https://sandbox.bcda.cms.gov/api/v2/jobs/{job_id}" \
    -H "Accept: application/fhir+json" \
    -H "Authorization: Bearer {token}"
```

### Response

`202 Accepted` if the cancellation succeeds.
