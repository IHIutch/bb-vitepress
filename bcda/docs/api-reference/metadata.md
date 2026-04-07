---
title: /metadata Endpoint
description: Check the BCDA API status, version, and FHIR CapabilityStatement.
---

# /metadata

Retrieve the [FHIR CapabilityStatement](https://hl7.org/fhir/R4/capabilitystatement.html) for the API. Returns the current version, status, and supported operations. **No authentication required.**

## Request

```
GET /api/v2/metadata
```

### Example

```shell
curl "https://sandbox.bcda.cms.gov/api/v2/metadata"
```

## Response

A FHIR CapabilityStatement resource in JSON format:

<details>
<summary>Full response example</summary>

```json
{
  "date": "2024-09-09T13:35:05+00:00",
  "fhirVersion": "4.0.1",
  "format": [
    "application/json",
    "application/fhir+json"
  ],
  "implementation": {
    "description": "The Beneficiary Claims Data API (BCDA) enables Accountable Care Organizations (ACOs) participating in the Shared Savings Program to retrieve Medicare Part A, Part B, and Part D claims data for their prospectively assigned or assignable beneficiaries.",
    "url": "https://sandbox.bcda.cms.gov"
  },
  "instantiates": [
    "https://prod.bfd.cms.gov/v2/fhir/metadata",
    "https://hl7.org/fhir/uv/bulkdata/CapabilityStatement/bulk-data"
  ],
  "kind": "instance",
  "publisher": "Centers for Medicare & Medicaid Services",
  "resourceType": "CapabilityStatement",
  "rest": [
    {
      "interaction": [
        { "code": "batch" },
        { "code": "search-system" }
      ],
      "mode": "server",
      "resource": [
        {
          "type": "Patient",
          "operation": [
            {
              "name": "patient-export",
              "definition": "https://hl7.org/fhir/uv/bulkdata/OperationDefinition/patient-export"
            }
          ]
        },
        {
          "type": "Group",
          "operation": [
            {
              "name": "group-export",
              "definition": "https://hl7.org/fhir/uv/bulkdata/OperationDefinition/group-export"
            }
          ]
        }
      ],
      "security": {
        "cors": true,
        "service": [
          {
            "coding": [
              {
                "code": "OAuth",
                "display": "OAuth",
                "system": "https://terminology.hl7.org/CodeSystem/restful-security-service"
              }
            ],
            "text": "OAuth"
          }
        ]
      }
    }
  ],
  "software": {
    "name": "Beneficiary Claims Data API",
    "releaseDate": "2024-09-09T13:35:05+00:00",
    "version": "r231"
  },
  "status": "active"
}
```

</details>

Key fields:
- `status` — Whether the API is currently active
- `fhirVersion` — The FHIR version (e.g., `4.0.1` for R4)
- `software.version` — The API release version
