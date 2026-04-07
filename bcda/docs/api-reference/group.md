---
title: /Group Endpoint
description: Export claims data for attributed enrollees using the /Group endpoint with all or runout identifiers.
---

# /Group

Export claims data for enrollees attributed to your organization using the [Bulk FHIR /Group endpoint](https://build.fhir.org/ig/HL7/bulk-data/export.html#endpoint---group-of-patients).

## Identifiers

- **`/Group/all`** — Data for all enrollees currently attributed to your organization
- **`/Group/runout`** — Data for enrollees attributed during the previous year but not the current year. Service dates are capped at December 31 of the previous year.

## Request

```
GET /api/v2/Group/{id}/$export
```

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `_type` | No | Comma-separated list of resource types. Omit to get all. |
| `_since` | No | FHIR instant date. Returns resources updated after this date for existing enrollees, and all resources for newly attributed enrollees. |
| `_typeFilter` | No | Filter by resource metadata. [v3 only](/guide/filtering#the-_typefilter-parameter). |

See [Filtering](/guide/filtering) for details on all parameters.

### Headers

```yaml
Authorization: Bearer {token}
Accept: application/fhir+json
Prefer: respond-async
```

### Example requests

**All resource types:**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

**Specific resource types:**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export?_type=ExplanationOfBenefit,Patient" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

**With _since (incremental export):**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export?_type=Patient&_since=2020-02-13T08:00:00.000-05:00" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

**Runout data:**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/runout/\$export" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

## Response

### 202 Accepted — job started

The `Content-Location` header contains the job URL for status polling:

```
Content-Location: https://sandbox.bcda.cms.gov/api/v2/jobs/42
```

### 429 Too Many Requests

Caused by:
1. Too many HTTP requests within a time period
2. Attempting to create a job that duplicates an in-progress job

Wait for the duration in the `Retry-After` header before retrying. See [Errors](/guide/errors#429-too-many-requests) for details.

## _since behavior

Using `_since` with /Group returns:
- **Existing enrollees**: only resources updated after the specified date
- **Newly attributed enrollees**: all resources regardless of date (as far back as 2014)

This lets you retrieve incremental updates and full history for new enrollees in a single request. Without `_since`, all historical data is returned.
