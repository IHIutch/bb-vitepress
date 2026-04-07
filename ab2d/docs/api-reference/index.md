---
description: Complete reference for AB2D API endpoints, query parameters, HTTP status codes, and data format.
---

# API Reference

::: info AB2D recommends v2
All documentation is written for v2 ([FHIR R4](https://hl7.org/fhir/R4/)). See [v1 differences](#v1-differences) if you are still using v1.
:::

## Authentication

AB2D uses [OAuth 2.0](https://oauth.net/2/) with the `client_credentials` grant type. You authenticate by Base64-encoding your client ID and password, then exchanging them for a bearer token.

::: code-group
```text [Sandbox]
https://test.idp.idm.cms.gov/oauth2/aus2r7y3gdaFMKBol297/v1/token
```
```text [Production]
https://idm.cms.gov/oauth2/aus2ytanytjdaF9cr297/v1/token
```
:::

```sh
curl -X POST "https://test.idp.idm.cms.gov/oauth2/aus2r7y3gdaFMKBol297/v1/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "Authorization: Basic ${base64_credentials}" \
  -d "grant_type=client_credentials&scope=clientCreds"
```

Bearer tokens expire after **30 minutes**. You must re-authenticate at least once every 30 minutes during a job.

## Endpoints

All endpoints use the same paths in both sandbox (`sandbox.ab2d.cms.gov`) and production (`api.ab2d.cms.gov`).

| Endpoint | Method | Path |
|---|---|---|
| Export | `GET` | `/api/v2/fhir/Patient/$export` |
| Status | `GET` | `/api/v2/fhir/Job/{job_uuid}/$status` |
| Download | `GET` | `/api/v2/fhir/Job/{job_uuid}/file/{file_name}` |
| Cancel | `DELETE` | `/api/v2/fhir/Job/{job_uuid}/$status` |
| Metadata | `GET` | `/api/v2/fhir/metadata` |

### Export

Start a job to export FHIR ExplanationOfBenefit (EOB) resources.

```sh
curl -i "https://sandbox.ab2d.cms.gov/api/v2/fhir/Patient/\$export" \
  -H "Accept: application/fhir+json" \
  -H "Prefer: respond-async" \
  -H "Authorization: Bearer ${bearer_token}"
```

**Response:** `202 Accepted` with a `Content-Location` header containing the job status URL:

```
Content-Location: https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/{job_uuid}/$status
```

If a job takes more than 30 hours, it will time out. Use [query parameters](#query-parameters) to reduce the data returned.

### Status

Check whether a job is complete.

```sh
curl "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${job_uuid}/\$status" \
  -H "Accept: application/fhir+json" \
  -H "Authorization: Bearer ${bearer_token}"
```

- **`202`** — Job in progress. The `x-progress` header shows completion percentage.
- **`200`** — Job complete. The response body contains file URLs:

```json
{
  "transactionTime": "2023-11-09T15:52:51.000+00:00",
  "request": "https://sandbox.ab2d.cms.gov/api/v2/fhir/Patient/$export",
  "requiresAccessToken": true,
  "output": [
    {
      "type": "ExplanationOfBenefit",
      "url": "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/{job_uuid}/file/Z0001_0001.ndjson"
    }
  ],
  "error": []
}
```

Too many status requests may result in a `Retry-After` header. Wait before making more requests.

### Download

Download an individual file from a completed job.

```sh
curl "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${job_uuid}/file/${file_name}" \
  -H "Accept: application/fhir+ndjson" \
  -H "Authorization: Bearer ${bearer_token}"
```

You can speed up downloads by requesting gzip compression:

```sh
curl "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${job_uuid}/file/${file_name}" \
  -H "Accept: application/fhir+ndjson" \
  -H "Accept-Encoding: gzip" \
  -H "Authorization: Bearer ${bearer_token}" \
  -o "${file_name}.gz"
```

::: warning
Job files expire after **72 hours** or **6 downloads**, whichever comes first.
:::

### Cancel

Cancel a job that has not yet completed.

```sh
curl -X DELETE "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${job_uuid}/\$status" \
  -H "Authorization: Bearer ${bearer_token}"
```

### Metadata

Retrieve the server's [FHIR CapabilityStatement](https://hl7.org/fhir/R4/capabilitystatement.html).

```sh
curl "https://sandbox.ab2d.cms.gov/api/v2/fhir/metadata" \
  -H "Accept: application/fhir+json"
```

## Query Parameters

Parameters filter the claims data returned when starting an export job. They follow the [ISO 8601 datetime format](https://en.wikipedia.org/wiki/ISO_8601): `yyyy-MM-dd'T'HH:mm:ss[+|-]hh:mm`. A time zone is **required**.

| Parameter | Description |
|---|---|
| `_since` | Filter for claims last updated **after** this date. Earliest allowed: January 1, 2020 or your attestation date, whichever is later. |
| `_until` | Filter for claims last updated **before** this date. Latest allowed: current date. |
| `_outputFormat` | Data format. Only `application/fhir+ndjson` is currently supported. |

### Default behavior

| `_since` | `_until` | Date range of export |
|---|---|---|
| Not set | Not set | Last successful export → current date |
| `2023-01-01` | Not set | `2023-01-01` → current date |
| Not set | `2024-01-01` | Last successful export → `2024-01-01` |
| `2023-01-01` | `2024-01-01` | `2023-01-01` → `2024-01-01` |

If this is your first job and `_since` is not set, it defaults to your earliest possible date (January 1, 2020 or attestation date).

### Valid and invalid parameter examples

| `_since` | `_until` | Valid? | Reason |
|---|---|---|---|
| `2020-10-10T03:00:00-06:00` | `2021-10-10T06:00:00-06:00` | Yes | Both dates are valid ISO format with time zones. |
| `2020-10-10T00:00:00` | `2020-10-20T00:00:00` | No | Time zone is missing. |
| `2019-12-30T00:00:00+00:00` | `2020-01-14T00:00:00+00:00` | No | `_since` is before January 1, 2020. The job runs but the value is replaced with the default. |
| `2020-10-10T16:00:00+00:00` | `3000-10-10T16:00:00+00:00` | No | `_until` is in the future. The job runs but the value is replaced with the current date. |
| `2020-10-10T09:00:00-08:00` | `2019-10-10T07:00:00-08:00` | No | `_until` is before `_since`. No data will be exported. |

### Percent-encoding

ISO 8601 dates include characters (`:`, `+`) that must be [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding) in URLs.

**Unencoded:**
```
/api/v2/fhir/Patient/$export?_since=2023-02-13T00:00:00.000-05:00
```

**Percent-encoded:**
```
/api/v2/fhir/Patient/$export?_since%3D2023-02-13T00%3A00%3A00.000-05%3A00
```

**curl example with `_since` and `_until`:**

```sh
curl -i "https://api.ab2d.cms.gov/api/v2/fhir/Patient/\$export?_since%3D2023-06-15T00%3A00%3A00.000-05%3A00%26_until%3D2024-06-15T00%3A00%3A00.000-05%3A00" \
  -H "Accept: application/json" \
  -H "Accept: application/fhir+json" \
  -H "Prefer: respond-async" \
  -H "Authorization: Bearer ${bearer_token}"
```

## Incremental Export Model

The recommended way to use AB2D is to periodically export data updated since your last job. The AB2D team encourages **bi-weekly exports**.

Incremental exports happen by default — no parameters required. This is because `_since` defaults to the datetime of your last successful export, and `_until` defaults to the current datetime.

### Example

1. Start your first job (JOB ID: ABC) and download the files.
2. Wait until the next bi-weekly update.
3. Start a new job (JOB ID: DEF). AB2D automatically sets `_since` to when ABC started.
4. Forget to download DEF's files before they expire (72 hours).
5. Start another job (JOB ID: GHI). `_since` defaults to when ABC started (not DEF), because DEF was never successfully completed.
6. Download GHI's files. Future jobs will default `_since` to when GHI started.

### Targeted date ranges

You can use `_since` and `_until` together to target a specific date range. For example, if one week of data was corrupted in your database, you can re-export just that week instead of re-running the entire job:

1. Identify the corrupted data range (e.g., November 12–18, 2023).
2. Run a job with `_since=2023-11-12` and `_until=2023-11-18`.
3. The job exports only that week of data, taking a fraction of the time.

## HTTP Status Codes

| Code | Meaning | What to do |
|---|---|---|
| 200 | Request completed successfully | — |
| 202 | Request accepted, still processing | Poll the status endpoint periodically |
| 400 | Bad request | Check for missing or malformed parameters |
| 401 | Unauthorized | Your token is incorrect or expired. Re-authenticate. |
| 403 | Forbidden | Permission denied. See details below. |
| 404 | Not found | Check the URL, job UUID, or file name. If using curl, escape the `$` character. |
| 405 | Method not allowed | Check you are using the correct HTTP method (GET vs DELETE). |
| 429 | Too many requests | Wait before making another request. |

<details>
<summary>403 troubleshooting details</summary>

A 403 can occur for several reasons:

- Your token has expired.
- You specified a contract that is not yours.
- You are not authorized to use the API.
- Your credentials have a typo, hidden character, or incorrect Base64 encoding.
- You are connected to the wrong identity provider (sandbox vs. production).
- The Authorization header is incorrect. Use `Authorization: Basic {base64_credentials}` when requesting a token, and `Authorization: Bearer {token}` when calling the API.

</details>

<details>
<summary>Unable to download files</summary>

- Your file name or job ID is incorrect. Check the job status response to verify.
- You have downloaded the file more than 6 times.
- Files expired (72 hours after job completion).
- Server error. Contact ab2d@cms.hhs.gov if the issue persists.

</details>

[Learn more about standard HTTP codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

## v1 Differences

Version 1 uses [FHIR STU3](https://hl7.org/fhir/STU3/explanationofbenefit.html). Version 2 uses [FHIR R4](https://hl7.org/fhir/R4/explanationofbenefit.html) and is recommended.

| | v1 (STU3) | v2 (R4) |
|---|---|---|
| Base path | `/api/v1/fhir/` | `/api/v2/fhir/` |
| `_until` parameter | Not available | Available |
| `_since` default | Earliest possible date (Jan 1, 2020 or attestation) | Last successful export date |
| Bulk Data spec | [v1.0.1](https://hl7.org/fhir/uv/bulkdata/STU1.0.1/) | [v2.0.0](https://hl7.org/fhir/uv/bulkdata/) |

In v1, if `_since` is not specified, every job exports all data from your earliest possible date, leading to large amounts of duplicate data. It is strongly recommended to always set `_since` manually in v1.

[Download the STU3-R4 Migration Guide (XLSX)](https://github.com/CMSgov/ab2d-pdp-documentation/raw/main/AB2D%20STU3-R4%20Migration%20Guide%20Final.xlsx)

## Data Format

AB2D exports data in [NDJSON (Newline Delimited JSON)](https://github.com/ndjson/ndjson-spec) format, where each line is a single JSON object representing a Medicare claim.

**File naming:** Files use a contract identifier and sequence number (e.g., `Z123456_0001.ndjson`).

**Compression:** You can optionally request gzip-compressed files using the `Accept-Encoding: gzip` header, then decompress them into NDJSON.

**Resources:**
- [Intro to JSON](https://json.org/)
- [NDJSON specification](https://github.com/ndjson/ndjson-spec)
- [JSON viewer/validator](https://jsonlint.com/)

You can also explore the API interactively using the [AB2D Swagger UI](https://sandbox.ab2d.cms.gov/swagger-ui/index.html?urls.primaryName=V2%20-%20FHIR%20R4).
