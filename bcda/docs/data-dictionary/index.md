---
title: Resource Types
description: FHIR resource types available in BCDA, including ExplanationOfBenefit, Patient, Coverage, Claim, and ClaimResponse.
---

# Resource types

BCDA delivers claims data as FHIR resources in NDJSON format. Each resource type contains a specific category of Medicare claims information. Request resource types using the [_type parameter](/guide/filtering#the-_type-parameter) at the [/Group](/api-reference/group) or [/Patient](/api-reference/patient) endpoints.

::: info Confidentiality
In accordance with HIPAA and 42 CFR Part 2, substance use disorder records are confidential and excluded from BCDA data. BCDA also excludes data for enrollees who have opted out of data sharing.
:::

## Adjudicated claims resources

Available to all [eligible model entities](/).

### ExplanationOfBenefit (EOB)

Details for episodes of care: where and when service was performed, diagnosis codes, provider, and cost of care. Similar to CCLF files 1-7.

- **FHIR spec:** [ExplanationOfBenefit](https://hl7.org/fhir/R4/explanationofbenefit.html)
- **Data:** Parts A, B, and D
- **Updated:** Weekly (from the [Chronic Conditions Data Warehouse](https://www2.ccwdata.org/web/guest/home))

<VersionedContent v="v3">

In v3, ExplanationOfBenefit is used for both adjudicated and partially adjudicated claims. Use the [_typeFilter parameter](/guide/filtering#the-_typefilter-parameter) to filter by adjudication status.

</VersionedContent>

### Patient

Enrollee demographic details and patient identifier updates. Similar to CCLF files 8 and 9.

- **FHIR spec:** [Patient](https://hl7.org/fhir/R4/patient.html)
- **Updated:** Weekly

<VersionedContent v="v3">

In v3, Patient data updates 6 times per week instead of once.

</VersionedContent>

### Coverage

Enrollee insurance coverage details, including dual coverage.

- **FHIR spec:** [Coverage](https://hl7.org/fhir/R4/coverage.html)
- **Updated:** Weekly

<VersionedContent v="v3">

In v3, Coverage data updates 6 times per week instead of once.

</VersionedContent>

## Partially adjudicated claims resources

<VersionedContent v="v1,v2">

Available to ACO REACH participants only. Requires v2.

### Claim

Financial and clinical details on professional and institutional claims. Used for treatment payment planning and reimbursement.

- **FHIR spec:** [Claim](https://hl7.org/fhir/R4/claim.html)
- **Data:** Parts A and B (excluding DME)
- **Updated:** Daily (from FISS and MCS)

### ClaimResponse

Adjudication status and processing results for a claim, predetermination, or preauthorization.

- **FHIR spec:** [ClaimResponse](https://hl7.org/fhir/R4/claimresponse.html)
- **Data:** Parts A and B (excluding DME)
- **Updated:** Daily (from FISS and MCS)

Every Claim has exactly one corresponding ClaimResponse. Claim and ClaimResponse resources are available for 60 days after their most recent update. After that, the claim is typically fully adjudicated and available through ExplanationOfBenefit.

::: tip Claim vs ClaimResponse vs EOB
Claim and ClaimResponse provide early access to claims still in processing. They contain a subset of the data available in EOB and are subject to more changes. EOB is more accurate for long-term records and provides the full set of data elements.
:::

</VersionedContent>

<VersionedContent v="v3">

In v3, partially adjudicated claims use the **ExplanationOfBenefit** resource type instead of Claim and ClaimResponse. Both adjudicated and partially adjudicated claims are sourced from the CMS Integrated Data Repository (IDR) and use a unified data structure.

Available to ACO REACH and IOTA participants.

- **Data:** Parts A and B from the current year plus 2+ historical years
- **Updated:** Daily (from Medicare Shared Systems via IDR)

Use the [_typeFilter parameter](/guide/filtering#the-_typefilter-parameter) to request only partially adjudicated claims (`NotFinalAction`) or only fully adjudicated claims (`FinalAction`).

Key fields for tracking partially adjudicated claims in v3:
- `ExplanationOfBenefit.outcome` — indicates whether the claim is still processing
- `CLM-CNTL-NUM` identifier — use for deduplication across adjudication stages
- `ExplanationOfBenefit.related` — links to previous claim control numbers

</VersionedContent>

## Data sources

| Data type | Source | Refresh |
|---|---|---|
| Adjudicated claims (v1/v2) | Chronic Conditions Data Warehouse (CCW) | Weekly |
| Partially adjudicated claims (v2) | FISS and MCS | Daily |
| All claims (v3) | CMS Integrated Data Repository (IDR) | Daily–6x/week |

## Data volume

The volume of data you receive depends on how many enrollees are attributed to your organization and how often claims are updated. Partially adjudicated claims data may appear larger because claims go through multiple rounds of processing and adjustment — you'll receive updates for each change.
