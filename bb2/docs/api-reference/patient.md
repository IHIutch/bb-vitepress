---
title: Patient
description: API reference for the Patient FHIR resource — demographics and identifiers.
---

# Patient

The Patient resource contains demographic and administrative information — name, date of birth, address, and Medicare identifiers.

::: tip
Users can deny access to demographics during authorization. If they do, requests to `/Patient` return `403 Forbidden`. Build your app to handle this case.
:::

## GET /v2/fhir/Patient

Returns a Bundle containing the authorized patient's resource.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Patient" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## GET /v2/fhir/Patient/\{id\} {#get-patient-by-id}

Returns a single Patient resource by ID.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Patient/-20140000000001" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `{id}` | string | Yes | Patient resource ID (negative number for synthetic data) |
| `_lastUpdated` | date | No | Filter by last update date |

## Response

```json
{
  "resourceType": "Patient",
  "id": "-20140000000001",
  "meta": {
    "lastUpdated": "2026-01-07T21:50:48.132-05:00",
    "profile": [
      "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Patient"
    ]
  },
  "identifier": [
    {
      "type": {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
            "code": "MC",
            "display": "Patient's Medicare number"
          }
        ]
      },
      "system": "http://hl7.org/fhir/sid/us-mbi",
      "value": "2S00A00AA00",
      "period": {
        "start": "2020-01-01"
      }
    }
  ],
  "name": [
    {
      "use": "usual",
      "family": "Doe",
      "given": ["Jane"]
    }
  ],
  "gender": "female",
  "birthDate": "1999-06-01",
  "address": [
    {
      "state": "FL",
      "postalCode": "33143"
    }
  ]
}
```

## Key fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Internal CCW patient ID |
| `identifier` | array | Business identifiers including [MBI](../data-dictionary/identifiers.md) (current and historic) |
| `name` | array | Patient name(s) |
| `gender` | string | `male`, `female`, `other`, `unknown` |
| `birthDate` | date | Date of birth |
| `deceasedDateTime` | date | Date of death (if applicable) |
| `address` | array | Address (state and postal code only) |
| `meta.lastUpdated` | instant | When this record was last updated |

### Identifiers

The `identifier` array may contain multiple entries — typically a current MBI and historic MBIs. See [Working with identifiers](../guide/fetching-patient-data.md#work-with-identifiers) for how to find the current MBI.

## Errors

- **200 OK** — Success
- **401 Unauthorized** — Invalid or expired access token
- **403 Forbidden** — User denied access to demographics
- **404 Not Found** — Patient not found
