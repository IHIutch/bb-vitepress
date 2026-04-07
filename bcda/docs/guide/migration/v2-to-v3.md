---
title: Migrate from v2 to v3
description: Actionable guide for migrating from BCDA v2 to v3, including unified data source, resource changes, and new filtering.
---

# Migrate from v2 to v3

BCDA v3 switches to a single data source (the CMS Integrated Data Repository), unifies partially and fully adjudicated claims into a single resource type, and adds new filtering capabilities.

## What's new in v3

- **Single data source** — All claims come from the IDR instead of separate CCW and RDA sources. This eliminates data mismatches between BCDA and CCLF files.
- **Unified ExplanationOfBenefit** — Both partially and fully adjudicated claims use EOB. Claim and ClaimResponse resource types are retired.
- **More frequent updates** — Patient and Coverage update 6x/week instead of weekly. Part D claims update 5x/week.
- **_typeFilter parameter** — Filter exports by adjudication status using resource metadata tags.
- **Improved FHIR conformance** — Conforms to [CARIN Blue Button IG v2.1.0](https://hl7.org/fhir/us/carin-bb/STU2.1/) and [Bulk Data Access IG STU 2](https://hl7.org/fhir/uv/bulkdata/STU2/).
- **Consistent claim identifiers** — Same identifiers across all adjudication phases, simplifying claim tracking.

## Problems solved

v3 resolves these known v2 issues:
- Mismatched data between BCDA resources and CCLF files
- Missing data for newly attributed enrollees
- Issues for enrollees assigned more than one BENE_ID
- Difficulty linking partially and fully adjudicated claims

### Claims flow comparison

In v2, fully adjudicated claims route through CCW while partially adjudicated claims route through RDA — two separate systems with different data structures. In v3, all claims route through the IDR, then through BFD to BCDA.

<!-- TODO: Asset missing — comparison-claims-flow.svg
![Claims flow comparison](/img/comparison-claims-flow.svg)
-->

## Migration checklist

### 1. Update endpoint URLs

Replace `v2` with `v3`:

| Before | After |
|---|---|
| `/api/v2/Group/all/$export` | `/api/v3/Group/all/$export` |
| `/api/v2/Patient/$export` | `/api/v3/Patient/$export` |
| `/api/v2/jobs/{id}` | `/api/v3/jobs/{id}` |
| `/api/v2/metadata` | `/api/v3/metadata` |

Auth and data download URLs remain the same.

### 2. Update resource type handling

If you currently request `Claim` and `ClaimResponse` for partially adjudicated data, switch to `ExplanationOfBenefit`:

| v2 | v3 |
|---|---|
| `_type=Claim,ClaimResponse` | `_type=ExplanationOfBenefit` |
| Partially adjudicated → Claim + ClaimResponse | Partially adjudicated → ExplanationOfBenefit |
| Fully adjudicated → ExplanationOfBenefit | Fully adjudicated → ExplanationOfBenefit |

### 3. Use _typeFilter to separate adjudication status

Since both claim types use EOB in v3, use `_typeFilter` to request specific adjudication states:

**Fully adjudicated only:**
```
_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/Final-Action|FinalAction
```

**Partially adjudicated only:**
```
_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/Final-Action|NotFinalAction
```

**By system type:**
```
_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/System-Type|SharedSystem
```

Omit `_typeFilter` to receive both types.

### 4. Update extension and CodeSystem URLs

v3 retires Blue Button Resources URLs for extensions and CodeSystems. Update any parsing logic that references these:

| v2 format | v3 format |
|---|---|
| `https://bluebutton.cms.gov/resources/variables/{name}` | `https://bluebutton.cms.gov/fhir/StructureDefinition/{name}` |
| `https://bluebutton.cms.gov/resources/codesystem/{name}` | `https://bluebutton.cms.gov/fhir/CodeSystem/{name}` |

### 5. Update resource matching logic

::: danger Do not match resources between versions using FHIR IDs
FHIR resource IDs (`Patient.id`, `ExplanationOfBenefit.id`) are not consistent between v2 and v3. Using them to match resources across versions will produce incorrect results.
:::

**Match beneficiaries using:**
- Medicare Beneficiary Identifier (MBI) + demographic fields (not `Patient.id`)

**Match claims using:**
- Claim control number (`CLM-CNTL-NUM` identifier, not `ExplanationOfBenefit.id`)
- In v3, the same claim control number tracks a claim across adjudication stages

### 6. Update your Data Dictionary

<!-- TODO: Asset missing — BCDA_v3_Data_Dictionary.xlsx
Download the <DownloadLink file="/downloads/BCDA_v3_Data_Dictionary.xlsx">BCDA v3 Data Dictionary</DownloadLink> for the complete field reference.
--> The v3 dictionary is automatically derived from upstream data sources, so field mappings are more reliable than in previous versions.

## Key v3 fields for partially adjudicated claims

- **`ExplanationOfBenefit.outcome`** — Indicates whether the claim is still processing
- **`CLM-CNTL-NUM` identifier** — Unique claim control number for deduplication
- **`ExplanationOfBenefit.related`** — Links to previous claim control numbers for tracking updates
- **`meta.tag` (Final-Action)** — `FinalAction` or `NotFinalAction` — adjudication status
- **`meta.tag` (System-Type)** — `SharedSystem` or `NationalClaimsHistory` — source system

## Questions?

Contact the BCDA team at [bcapi@cms.hhs.gov](mailto:bcapi@cms.hhs.gov) for help with your v3 migration.
