---
title: Quickstart
description: Get from zero to downloaded Medicare claims data in 5 steps using the BCDA sandbox.
---

# Quickstart

This guide gets you from zero to downloaded claims data in the BCDA sandbox. You'll need a terminal or a tool like Postman.

The sandbox contains synthetic test data — not real Medicare enrollee data. The same workflow applies to the production environment with [production credentials](/production/).

## 1. Copy sandbox credentials

Use the extra-small dataset (50 synthetic enrollees) to get started:

<SandboxCredentials dataset="extra-small" />

**Client ID:**
```
2462c96b-6427-4efb-aed7-118e20c2e997
```

**Client Secret:**
```
e5bf53ec3a4304ab43c00155cfe1f01a00a6f6003ad07d323b3b6bce9ad4ae5b137ef4e8509d881b
```

## 2. Get a bearer token

Request a bearer token using your credentials. The token expires after 20 minutes.

::: code-group
```shell [curl]
curl -d "" -X POST "https://sandbox.bcda.cms.gov/auth/token" \
    --user 2462c96b-6427-4efb-aed7-118e20c2e997:e5bf53ec3a4304ab43c00155cfe1f01a00a6f6003ad07d323b3b6bce9ad4ae5b137ef4e8509d881b \
    -H "Accept: application/json"
```
```python [Python]
import requests

response = requests.post(
    "https://sandbox.bcda.cms.gov/auth/token",
    auth=(
        "2462c96b-6427-4efb-aed7-118e20c2e997",
        "e5bf53ec3a4304ab43c00155cfe1f01a00a6f6003ad07d323b3b6bce9ad4ae5b137ef4e8509d881b"
    ),
    headers={"Accept": "application/json"}
)

token = response.json()["access_token"]
print(token)
```
:::

You'll receive a response like:

```json
{
  "access_token": "eyJhbGciOiJSUzUxMiIsInR...",
  "expires_in": "1200",
  "token_type": "bearer"
}
```

Copy the `access_token` value. You'll use it in the next steps as `{token}`.

## 3. Start an export job

Request an export of all resource types from the /Group endpoint:

::: code-group
```shell [curl]
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```
```python [Python]
response = requests.get(
    "https://sandbox.bcda.cms.gov/api/v2/Group/all/$export",
    headers={
        "Accept": "application/fhir+json",
        "Prefer": "respond-async",
        "Authorization": f"Bearer {token}"
    }
)

job_url = response.headers["Content-Location"]
print(job_url)
```
:::

A `202 Accepted` response means the job started. The `Content-Location` header contains your job URL:

```
Content-Location: https://sandbox.bcda.cms.gov/api/v2/jobs/42
```

Save the job URL (or just the job ID) for the next step.

::: tip Filtering
Add `?_type=Patient,ExplanationOfBenefit` to export only specific resource types. See [Filtering](/guide/filtering) for all options.
:::

## 4. Check job status

Poll the job URL until the status changes from `202` (in progress) to `200` (complete):

::: code-group
```shell [curl]
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/jobs/{job_id}" \
    -H "Accept: application/fhir+json" \
    -H "Authorization: Bearer {token}" \
    -i
```
```python [Python]
import time

while True:
    status = requests.get(
        job_url,
        headers={
            "Accept": "application/fhir+json",
            "Authorization": f"Bearer {token}"
        }
    )
    if status.status_code == 200:
        break
    print(f"In progress... {status.headers.get('X-Progress', '')}")
    time.sleep(5)

job_result = status.json()
print(job_result)
```
:::

When complete, the `200` response body lists download URLs for each resource type:

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

## 5. Download the data

Download each file using the URLs from the previous step:

::: code-group
```shell [curl]
curl -X GET "https://sandbox.bcda.cms.gov/data/{job_id}/{file_name}" \
    -H "Accept-Encoding: gzip" \
    -H "Authorization: Bearer {token}"
```
```python [Python]
for output in job_result["output"]:
    file_response = requests.get(
        output["url"],
        headers={
            "Accept-Encoding": "gzip",
            "Authorization": f"Bearer {token}"
        }
    )
    filename = f"{output['type']}.ndjson"
    with open(filename, "w") as f:
        f.write(file_response.text)
    print(f"Downloaded {filename} ({len(file_response.text)} bytes)")
```
:::

::: warning Files expire after 24 hours
You can download files using a new bearer token if your original expires. After 24 hours, files are deleted and you'll need to restart the job.
:::

Add `Accept-Encoding: gzip` to download compressed files for faster transfer, then decompress into NDJSON format.

## What's next

- **Explore the data** — See [Resource Types](/data-dictionary/) to understand what each file contains
- **Filter your exports** — Use [parameters](/guide/filtering) to request specific resource types or date ranges
- **Get production access** — Follow the steps on [Production Access](/production/) to access real enrollee data
- **Try larger datasets** — See [Authentication](/guide/authentication#sandbox-credentials) for all sandbox credential sets, including 30,000-enrollee datasets and partially adjudicated claims

::: info Sandbox vs production
The sandbox and production environments use the same workflow, endpoints, and parameters. The only differences are the base URL (`sandbox.bcda.cms.gov` vs `api.bcda.cms.gov`) and credentials.
:::
