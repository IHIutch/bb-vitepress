---
title: Data Dictionary
description: Understand the data Blue Button delivers — coding systems, identifiers, and variables.
---

# Data Dictionary

Blue Button delivers Medicare claims data from the CMS Chronic Conditions Warehouse (CCW). This section helps you decode the values in API responses — what the codes mean, what the identifiers represent, and where to look things up.

## What data Blue Button serves

Blue Button provides Medicare fee-for-service claims data across three coverage types:

| Medicare Part | Coverage | Example claims |
|---------------|----------|----------------|
| **Part A** | Hospital insurance | Inpatient stays, skilled nursing, hospice, home health |
| **Part B** | Medical insurance | Doctor visits, outpatient procedures, lab work, DME |
| **Part D** | Prescription drugs | Pharmacy fills |

This data is delivered through three FHIR resources:

| Resource | What it contains | Typical size |
|----------|-----------------|--------------|
| [Patient](../api-reference/patient.md) | Demographics — name, DOB, address, MBI | Small (one resource) |
| [Coverage](../api-reference/coverage.md) | Insurance coverage — plan type, eligibility periods | Small (a few resources) |
| [ExplanationOfBenefit](../api-reference/explanation-of-benefit.md) | Claims — diagnoses, procedures, providers, costs | Large (dozens to hundreds) |

## How coding systems work

FHIR uses coding systems to represent standardized values. A coded value has three parts:

```json
{
  "coding": [
    {
      "system": "https://bluebutton.cms.gov/resources/codesystem/eob-type",
      "code": "CARRIER",
      "display": "Carrier (professional) claim"
    }
  ]
}
```

- **`system`** — A URI identifying which coding system the code belongs to
- **`code`** — The coded value
- **`display`** — Human-readable description

Blue Button uses coding systems from several sources:

- **CMS/Blue Button** — [EOB type](./code-systems.md), [adjudication codes](./code-systems.md), claim variables
- **Industry standard** — [ICD-10](https://www.cms.gov/Medicare/Coding/ICD10), [HCPCS](https://www.cms.gov/Medicare/Coding/MedHCPCSGenInfo), [NDC](https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory)
- **FHIR/HL7** — Standard FHIR value sets, CARIN IG code systems

<!-- TODO: Asset missing — bluebutton_system_listing.csv
For a complete listing: [Blue Button Code System Listing (CSV)](/assets/files/bluebutton_system_listing.csv)
-->

## Reference sections

- [Code Systems](./code-systems.md) — CMS-defined code systems used in Blue Button responses
- [Identifiers](./identifiers.md) — Business identifiers like MBI and claim group IDs
- [Variables](./variables.md) — CCW data dictionary variables used in extensions

## Data freshness

Claims data is pulled from the CCW into Blue Button on a **weekly** basis. New claims appear 1-2 weeks after the service date, reflecting real claim processing time.

Use the [`_lastUpdated` parameter](../guide/going-to-production.md#use-_lastupdated-for-incremental-sync) to fetch only records that changed since your last sync.

## Synthetic data

Blue Button provides 10,000 synthetic user accounts for testing:

- **`BBUser00000` – `BBUser09999`** — Rolling claims updated weekly. Range of demographics and ages.
- **`BBUser10000`** — Special account with nearly every field populated — great for testing edge cases.

Login pattern: username `BBUser00000`, password `PW00000!` (replace `00000` with the account number).

Synthetic records have **negative** Patient IDs (e.g., `-20140000000001`). Real production IDs are always positive.

::: tip
<!-- TODO: Asset missing — synthetic_users_by_claim_count_full.csv
Use the [synthetic users CSV](/assets/files/synthetic_users_by_claim_count_full.csv) to find users with specific claim volumes and types for testing.
-->
:::
