---
title: /Patient Endpoint
description: Export claims data for all currently attributed enrollees using the /Patient endpoint.
---

# /Patient

Export claims data for all Medicare enrollees currently attributed to your organization using the [Bulk FHIR /Patient endpoint](https://build.fhir.org/ig/HL7/bulk-data/export.html#endpoint---all-patients).

Similar to `/Group/all`, but with different `_since` behavior for newly attributed enrollees.

## Request

```
GET /api/v2/Patient/$export
```

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `_type` | No | Comma-separated list of resource types. Omit to get all. |
| `_since` | No | FHIR instant date. Returns resources updated after this date for both existing and newly attributed enrollees. |
| `_typeFilter` | No | Filter by resource metadata. [v3 only](/guide/filtering#the-_typefilter-parameter). |

### Headers

```yaml
Authorization: Bearer {token}
Accept: application/fhir+json
Prefer: respond-async
```

### Example request

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Patient/\$export?_type=Patient&_since=2020-02-13T08:00:00.000-05:00" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

## Response

Same as [/Group response](/api-reference/group#response): `202 Accepted` with a `Content-Location` header for job status polling.

## _since behavior

Using `_since` with /Patient returns resources updated after the specified date for **both existing and newly attributed enrollees**. Unlike /Group, it does not return full history for newly attributed enrollees.

Without `_since`, returns data as far back as 2014.

## When to use /Patient vs /Group

| | /Patient | /Group |
|---|---|---|
| **_since with new enrollees** | Only updates after the date | Full history for new enrollees |
| **Runout support** | No | Yes (`/Group/runout`) |
| **Use when** | You want uniform date filtering for all enrollees | You want full history for newly attributed enrollees in one request |
