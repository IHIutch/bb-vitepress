---
title: Code Systems
description: CMS-defined code systems used in Blue Button API responses.
---

# Code Systems

Code systems define the valid values for coded fields in Blue Button responses. When you see a `coding` object in a response, the `system` URI tells you which code system to look up.

## What's a code system?

In FHIR, a code system is a defined set of codes with meanings. For example, the `eob-type` code system defines codes like `CARRIER`, `INPATIENT`, and `PDE` that identify claim types. When you see:

```json
{
  "system": "https://bluebutton.cms.gov/resources/codesystem/eob-type",
  "code": "CARRIER"
}
```

...you know this is a carrier (physician/supplier) claim.

## Blue Button code systems

These code systems are defined by CMS specifically for the Blue Button API:

| Code System | System URI | Description |
|-------------|-----------|-------------|
| [Adjudication](../resources/codesystem/adjudication) | `https://bluebutton.cms.gov/resources/codesystem/adjudication` | Financial adjudication categories — what was billed, allowed, and paid |
| [Benefit Balance](../resources/codesystem/benefit-balance) | `https://bluebutton.cms.gov/resources/codesystem/benefit-balance` | Benefit balance categories for coverage information |
| [Diagnosis Type](../resources/codesystem/diagnosis-type) | `https://bluebutton.cms.gov/resources/codesystem/diagnosis-type` | Classifies diagnoses (principal, admitting, external cause, etc.) |
| [EOB Type](../resources/codesystem/eob-type) | `https://bluebutton.cms.gov/resources/codesystem/eob-type` | Claim type codes — CARRIER, INPATIENT, PDE, etc. |
| [HCPCS](../resources/codesystem/hcpcs) | `https://bluebutton.cms.gov/resources/codesystem/hcpcs` | Healthcare Common Procedure Coding System |
| [Identifier Currency](../resources/codesystem/identifier-currency) | `https://bluebutton.cms.gov/resources/codesystem/identifier-currency` | Whether an identifier is `current` or `historic` |
| [Information](../resources/codesystem/information) | `https://bluebutton.cms.gov/resources/codesystem/information` | Supporting information categories |

## Industry-standard code systems

Blue Button also uses these widely adopted coding systems:

| Code System | Used for |
|-------------|----------|
| [ICD-10](https://www.cms.gov/Medicare/Coding/ICD10) | Diagnosis codes |
| [HCPCS](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo) | Procedure and service codes |
| [CPT](https://www.ama-assn.org/amaone/cpt-current-procedural-terminology) | Procedure codes (subset of HCPCS) |
| [NDC](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory) | Drug codes (Part D claims) |
| [NPI](https://npiregistry.cms.hhs.gov/) | Provider identification |

## CARIN IG code systems

The [CARIN Implementation Guide](http://www.hl7.org/fhir/us/carin-bb/index.html) defines additional code systems used in Blue Button responses. See the [CARIN terminology page](http://www.hl7.org/fhir/us/carin-bb/artifacts.html#5) for details.

## Resources

- [Blue Button Code System Listing (CSV)](/assets/files/bluebutton_system_listing.csv) — Complete list of all code systems
- [Blue Button Extensions in v2 (CSV)](/assets/files/BB_V2_extension_listing.csv) — All extension URLs and their value types
