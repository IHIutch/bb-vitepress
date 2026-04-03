---
title: ExplanationOfBenefit
description: API reference for the ExplanationOfBenefit FHIR resource — Medicare claims data.
---

# ExplanationOfBenefit

The ExplanationOfBenefit (EOB) resource is the core of the Blue Button API. Each EOB represents a processed Medicare claim — every doctor visit, hospital stay, and prescription. This is where the bulk of the data lives.

::: warning
EOB responses are large and paginated. A single patient can have hundreds of claims. See [Handling Pagination](../guides/handling-pagination.md).
:::

## GET /v2/fhir/ExplanationOfBenefit

Returns a paginated Bundle of all EOB resources for the authorized patient.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?_count=50" \
  -H "Accept: application/json" \
  -H "Accept-Encoding: gzip" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## GET /v2/fhir/ExplanationOfBenefit?patient=\{id\} {#get-eob-by-patient}

Returns EOBs for a specific patient.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?patient=-20140000000001&_count=50" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## GET /v2/fhir/ExplanationOfBenefit/\{id\} {#get-eob-by-id}

Returns a single EOB by ID.

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit/carrier--10045426206" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `patient` | string | No | Patient resource ID |
| `{id}` | string | No | EOB resource ID (for single read) |
| `_count` | integer | No | Results per page (default 10, max 50) |
| `_lastUpdated` | date | No | Filter by last update date. Operators: `gt`, `lt`, `ge`, `le` |
| `type` | string | No | Filter by claim type. Comma-separated. Values: `carrier`, `dme`, `hha`, `hospice`, `inpatient`, `outpatient`, `snf`, `pde` |

### Examples

```bash
# Only pharmacy claims
/ExplanationOfBenefit?type=pde

# Claims updated after March 1
/ExplanationOfBenefit?_lastUpdated=gt2026-03-01T00:00:00-05:00

# Multiple claim types
/ExplanationOfBenefit?type=carrier,inpatient,outpatient
```

## Response

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 89,
  "link": [
    {
      "relation": "next",
      "url": "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=10&_count=10&patient=..."
    }
  ],
  "entry": [
    {
      "resource": {
        "resourceType": "ExplanationOfBenefit",
        "id": "carrier--10045426206",
        "meta": {
          "lastUpdated": "2026-01-07T21:51:33.787-05:00",
          "profile": [
            "http://hl7.org/fhir/us/carin-bb/StructureDefinition/C4BB-ExplanationOfBenefit-Professional-NonClinician"
          ]
        },
        "identifier": [
          {
            "type": {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType",
                  "code": "uc",
                  "display": "UniqueClaimID"
                }
              ]
            },
            "system": "https://bluebutton.cms.gov/resources/variables/clm_id",
            "value": "-10045426206"
          }
        ],
        "type": {
          "coding": [
            {
              "code": "CARRIER",
              "system": "https://bluebutton.cms.gov/resources/codesystem/eob-type"
            },
            {
              "code": "71",
              "display": "Local carrier non-durable medical equipment claim",
              "system": "https://bluebutton.cms.gov/resources/variables/nch_clm_type_cd"
            }
          ]
        },
        "patient": {
          "reference": "Patient/-20140000000001"
        },
        "billablePeriod": {
          "start": "2025-01-15",
          "end": "2025-01-15"
        },
        "provider": {
          "reference": "#provider-org"
        },
        "contained": [ ... ],
        "careTeam": [ ... ],
        "diagnosis": [ ... ],
        "item": [ ... ],
        "payment": { ... }
      }
    }
  ]
}
```

## Key fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Claim ID (format: `{type}--{number}`) |
| `type` | CodeableConcept | [Claim type](../data-dictionary/code-systems.md) (CARRIER, INPATIENT, PDE, etc.) |
| `patient` | Reference | Link to Patient resource |
| `billablePeriod` | Period | Service date range |
| `provider` | Reference | Rendering provider (usually a contained Organization) |
| `careTeam` | array | Providers involved (with NPIs and roles) |
| `diagnosis` | array | ICD-10 diagnosis codes |
| `item` | array | Line items — individual services, with adjudication amounts |
| `payment` | object | Total payment information |
| `contained` | array | Embedded resources (Organization, etc.) |
| `extension` | array | Medicare-specific data points ([Data Dictionary](../data-dictionary/index.md)) |
| `supportingInfo` | array | Additional claim information (CARIN IG format) |

For a detailed walkthrough of item structure, adjudication, and claim types, see [Working with Claims](../guides/working-with-claims.md).

## Claim types

| `eob-type` code | Description |
|-----------------|-------------|
| `CARRIER` | Physician/supplier claims |
| `INPATIENT` | Hospital inpatient stays |
| `OUTPATIENT` | Hospital outpatient services |
| `PDE` | Prescription Drug Events |
| `DME` | Durable Medical Equipment |
| `HHA` | Home Health Agency |
| `HOSPICE` | Hospice care |
| `SNF` | Skilled Nursing Facility |

## Errors

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Invalid parameters (e.g., bad claim type value) |
| 401 | Invalid or expired access token |
| 404 | EOB not found |
| 429 | Rate limit exceeded |
