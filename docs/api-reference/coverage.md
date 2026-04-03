---
title: Coverage
description: API reference for the Coverage FHIR resource — insurance and plan information.
---

# Coverage

The Coverage resource provides information about the patient's Medicare insurance coverage, including Part A, Part B, Part C, and Part D plans.

## GET /v2/fhir/Coverage

Returns a Bundle of Coverage resources for the authorized patient.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Coverage" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## GET /v2/fhir/Coverage?beneficiary=\{id\} {#get-coverage-by-beneficiary}

Returns Coverage resources for a specific patient.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Coverage?beneficiary=-20140000000001" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `beneficiary` | string | No | Patient resource ID |
| `_lastUpdated` | date | No | Filter by last update date |

## Response

A patient typically has multiple Coverage resources — one for each coverage type (Part A, Part B, Part C, Part D):

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 4,
  "entry": [
    {
      "resource": {
        "resourceType": "Coverage",
        "id": "part-a--20140000000001",
        "meta": {
          "lastUpdated": "2026-01-07T21:50:48.132-05:00",
          "profile": [
            "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-Coverage"
          ]
        },
        "status": "active",
        "type": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              "code": "SUBSIDIZ"
            }
          ]
        },
        "subscriberId": "2S00A00AA00",
        "beneficiary": {
          "reference": "Patient/-20140000000001"
        },
        "relationship": {
          "coding": [
            {
              "system": "http://terminology.hl7.org/CodeSystem/subscriber-relationship",
              "code": "self"
            }
          ]
        },
        "period": {
          "start": "2020-01-01"
        }
      }
    }
  ]
}
```

## Key fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Coverage ID (prefixed with part type, e.g., `part-a--`) |
| `status` | string | `active` or `cancelled` |
| `type` | CodeableConcept | Coverage type code |
| `subscriberId` | string | Medicare Beneficiary ID |
| `beneficiary` | Reference | Link to Patient resource |
| `relationship` | CodeableConcept | Relationship to subscriber (typically `self`) |
| `period` | Period | Coverage start and end dates |
| `extension` | array | Medicare-specific coverage details (buy-in indicators, entitlement codes, etc.) |

## Errors

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 401 | Invalid or expired access token |
| 404 | Patient not found |
