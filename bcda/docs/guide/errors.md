---
title: Errors & Troubleshooting
description: BCDA API response codes, common errors, and how to resolve them.
---

# Errors & troubleshooting

## Response codes

| Code | Meaning | When you'll see it |
|---|---|---|
| **200 OK** | Request succeeded | Job complete and ready to download; metadata retrieved |
| **202 Accepted** | Request accepted, processing | Export job started; job still in progress; job cancelled |
| **400 Bad Request** | Invalid request | Malformed parameters, invalid date format for _since |
| **401 Unauthorized** | Authentication failed | Missing, invalid, or expired bearer token |
| **403 Forbidden** | Access denied | Requesting resources your organization doesn't have access to (e.g., partially adjudicated claims without ACO REACH participation) |
| **404 Not Found** | Resource not found | Invalid job ID; no attribution data for your organization; no jobs to return |
| **429 Too Many Requests** | Rate limited | Too many requests in a time period; duplicate in-progress job |
| **500 Internal Server Error** | Server error | Unexpected server-side failure. Contact [support](/support) if persistent |

## Common issues

### 401 Unauthorized

Your bearer token is missing, malformed, or expired.

**Check:**
- Token is included in the `Authorization` header
- Header format is exactly `Authorization: Bearer {token}` (capital B, space after Bearer)
- Token was generated less than 20 minutes ago
- You're using the correct environment URL (`sandbox.bcda.cms.gov` vs `api.bcda.cms.gov`)
- Your production credentials haven't expired (must be rotated every 90 days)

### 429 Too Many Requests

Two possible causes:

1. **Rate limit exceeded** — You've made too many HTTP requests within a time period
2. **Duplicate job** — You're attempting to start an export that duplicates a job already in progress

**Resolution:** Wait for the duration specified in the `Retry-After` header before making more requests. Don't hard-code retry timings — read the header so your client adapts if rate-limiting parameters change.

You can check existing jobs using the [/jobs endpoint](/api-reference/jobs) to avoid creating duplicates.

### Connection timeouts with production credentials

Production API requests must originate from a registered IP address.

**Check:**
- Your IP address is on the allow list in your model-specific system ([ACO-MS](https://acoms.cms.gov/api-key-mgmt/bcda) or [4innovation](https://4innovation.cms.gov/secure/api-credentials/bcda))
- Allow list changes may take up to an hour to propagate
- If using a vendor, their IP addresses must also be registered (up to 8 total)

### Bearer token expired mid-workflow

Bearer tokens expire after 20 minutes. If your token expires during a workflow:

- **In-progress jobs are not affected.** Jobs continue running regardless of token expiry.
- **Completed jobs:** Generate a new token to download the files. Files remain available for 24 hours after job completion.
- **After 24 hours:** Files expire. Restart the export job.

### Production credentials expired

Credentials must be rotated every 90 days. Visit your model-specific system to rotate them:

- **SSP ACOs:** [ACO-MS](https://acoms.cms.gov/api-key-mgmt/bcda) (requires Credential Delegate role)
- **ACO REACH and KCC:** [4innovation](https://4innovation.cms.gov/secure/api-credentials/bcda)

If credentials may be compromised, revoke them immediately and email [bcapi@cms.hhs.gov](mailto:bcapi@cms.hhs.gov) to review recent activity.

### Wrong environment URL

- **Sandbox:** `sandbox.bcda.cms.gov`
- **Production:** `api.bcda.cms.gov`

Sandbox credentials do not work in production and vice versa.

## Error files

If some data can't be exported during a job, the job response includes an `error` array with URLs to NDJSON files containing [FHIR OperationOutcome](https://www.hl7.org/fhir/operationoutcome.html) resources describing the issues.

## Security warning

::: danger Third-party REST clients
Use caution with web-based REST clients. Sharing your credentials with a third party allows them to make API calls on your behalf. This is a serious data privacy and security risk. Use secure, locally-installed REST client tools.
:::
