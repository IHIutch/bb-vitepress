---
title: Fetching Patient Data
description: Make API requests, read FHIR responses, and work with identifiers and references.
---

# Fetching Patient Data

You've got an access token. Now let's fetch data and understand what comes back.

## Make a request

Blue Button has three main FHIR resources. Here's how to fetch each one:

```bash
# Patient — demographics
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Patient" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Coverage — insurance and plan info
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Coverage" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ExplanationOfBenefit — all claims
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.bluebutton.cms.gov/v2/fhir/` |
| Production | `https://api.bluebutton.cms.gov/v2/fhir/` |

For the full list of endpoints and parameters, see the [API Reference](../api-reference/index.md) or the [Swagger docs](https://sandbox.bluebutton.cms.gov/docs/openapi).

## Read the response

Search operations (`/Patient`, `/ExplanationOfBenefit`) return FHIR Bundles — a container with a list of resources:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 99,
  "entry": [
    {
      "resource": {
        "resourceType": "ExplanationOfBenefit",
        "id": "carrier--123"
      }
    },
    {
      "resource": {
        "resourceType": "ExplanationOfBenefit",
        "id": "carrier--456"
      }
    }
  ]
}
```

- `total` tells you how many resources match
- `entry` contains the actual resources (paginated — default 10 per page)
- Each `entry[].resource` is a full FHIR resource

Read operations with an ID (`/Patient/-20140000000001`) return a single resource directly, not wrapped in a Bundle.

::: tip
EOB bundles can be large — hundreds of claims per patient. See [Handling Pagination](./handling-pagination.md) for how to work through them.
:::

## Work with identifiers

FHIR resources have two kinds of IDs that can be confusing:

- **`Resource.id`** — An internal ID from the CMS Chronic Conditions Warehouse (CCW). Use it to fetch a specific resource by ID (e.g., `/Patient/-20140000000001`). Always one value, always unique.
- **`identifier`** — Business identifiers like the Medicare Beneficiary ID (MBI) — the number on someone's Medicare card. Can have multiple values (e.g., current and historic MBIs).

### Finding the current MBI

A patient may have multiple MBIs (e.g., after identity theft or a replacement card). Use discriminators to find the current one:

```json
{
  "identifier": [
    {
      "system": "http://hl7.org/fhir/sid/us-mbi",
      "type": {
        "coding": [
          {
            "code": "MC",
            "extension": [
              {
                "url": "https://bluebutton.cms.gov/resources/codesystem/identifier-currency",
                "valueCoding": { "code": "current" }
              }
            ]
          }
        ]
      },
      "value": "1S00-E00-AA00"
    },
    {
      "system": "http://hl7.org/fhir/sid/us-mbi",
      "type": {
        "coding": [
          {
            "code": "MC",
            "extension": [
              {
                "url": "https://bluebutton.cms.gov/resources/codesystem/identifier-currency",
                "valueCoding": { "code": "historic" }
              }
            ]
          }
        ]
      },
      "value": "9A00-B00-CC00"
    }
  ]
}
```

To pull the current MBI, match on:
- `identifier.system` = `http://hl7.org/fhir/sid/us-mbi`
- `identifier.type.coding[].extension[].valueCoding.code` = `"current"`

FHIRPath expression:

```
Patient.identifier
  .where(type.coding.extension('https://bluebutton.cms.gov/resources/codesystem/identifier-currency').valueCoding.code = 'current')
  .where(system = 'http://hl7.org/fhir/sid/us-mbi')
  .value
```

## Understand references

Blue Button uses three kinds of FHIR references to link resources together.

### Literal references

A relative URL pointing to another resource. Append it to the base FHIR URL to fetch the referenced resource.

```json
{
  "patient": {
    "reference": "Patient/-20140000000001"
  }
}
```

### Contained resources

Some resources don't have their own endpoint — they're embedded inside another resource. For example, the Organization providing care is contained within the EOB:

```json
{
  "contained": [
    {
      "resourceType": "Organization",
      "id": "provider-org",
      "identifier": [
        {
          "type": {
            "coding": [
              {
                "code": "PRN",
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203"
              }
            ]
          }
        }
      ]
    }
  ],
  "provider": {
    "reference": "#provider-org"
  }
}
```

The `#` prefix means "look in the `contained` array for a resource with this `id`."

### Logical references

A business identifier instead of a URL — useful when the referenced resource doesn't have an endpoint. For example, a provider's NPI:

```json
{
  "careTeam": [
    {
      "provider": {
        "identifier": {
          "type": {
            "coding": [
              {
                "code": "npi",
                "display": "National Provider Identifier",
                "system": "http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBIdentifierType"
              }
            ]
          },
          "value": "1234567890"
        }
      }
    }
  ]
}
```

Blue Button doesn't have a `/Practitioner` endpoint — look up NPIs using the [NPI Registry](https://npiregistry.cms.hhs.gov/).

## Extensions and supportingInfo

Blue Button includes Medicare-specific data points that aren't part of standard FHIR. These show up in two places:

### Extensions

Extensions are key-value pairs where the URL is the key. The value type varies by extension:

```json
{
  "extension": [
    {
      "url": "https://bluebutton.cms.gov/resources/variables/nch_near_line_rec_ident_cd",
      "valueCoding": {
        "code": "O",
        "display": "Part B physician/supplier claim record",
        "system": "https://bluebutton.cms.gov/resources/variables/nch_near_line_rec_ident_cd"
      }
    },
    {
      "url": "https://bluebutton.cms.gov/resources/variables/carr_num",
      "valueIdentifier": {
        "system": "https://bluebutton.cms.gov/resources/variables/carr_num",
        "value": "15202"
      }
    }
  ]
}
```

The extension URL points to the [Data Dictionary](../data-dictionary/index.md) where you can look up what each value means.

### supportingInfo

Used in ExplanationOfBenefit resources. Similar to extensions but uses `category` as the key and `code` as the value:

```json
{
  "supportingInfo": [
    {
      "category": {
        "coding": [
          {
            "code": "typeofbill",
            "system": "http://hl7.org/fhir/us/carin-bb/CodeSystem/C4BBSupportingInfoType"
          }
        ]
      },
      "code": {
        "coding": [
          {
            "code": "131",
            "system": "https://bluebutton.cms.gov/resources/variables/clm_freq_cd"
          }
        ]
      }
    }
  ]
}
```

::: tip
The [CARIN Implementation Guide](http://www.hl7.org/fhir/us/carin-bb/index.html) prefers `supportingInfo` over extensions. Blue Button provides data in both for backwards compatibility.
:::

## Determine claim type

All claims come through the ExplanationOfBenefit resource. To figure out what type of claim you're looking at, check `EOB.type`:

```json
{
  "type": {
    "coding": [
      {
        "code": "71",
        "display": "Local carrier non-durable medical equipment claim",
        "system": "https://bluebutton.cms.gov/resources/variables/nch_clm_type_cd"
      },
      {
        "code": "CARRIER",
        "system": "https://bluebutton.cms.gov/resources/codesystem/eob-type"
      }
    ]
  }
}
```

The `eob-type` coding gives you the clearest value. Possible types: `CARRIER`, `DME`, `HHA`, `HOSPICE`, `INPATIENT`, `OUTPATIENT`, `SNF`, `PDE`.

For filtering by claim type in your requests, see [Going to Production](./going-to-production.md#optimize-your-queries).
