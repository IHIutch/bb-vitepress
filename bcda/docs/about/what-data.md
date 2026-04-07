---
title: What Data You'll Get
description: BCDA provides Medicare Parts A, B, and D claims data including hospital stays, doctor visits, prescriptions, and insurance coverage.
---

# What data you'll get

BCDA provides your organization with records of your attributed enrollees' healthcare activity. This includes hospital stays, doctor visits, outpatient procedures, prescriptions, and insurance coverage details. Data includes diagnosis codes, dates and locations of service, provider information, and cost of care.

## Types of claims data

- **Medicare Part A** — Inpatient hospital stays, skilled nursing facilities, hospice care
- **Medicare Part B** — Doctor visits, outpatient care, preventive services, durable medical equipment
- **Medicare Part D** — Prescription drugs prescribed by healthcare providers

## Adjudicated vs partially adjudicated claims

BCDA provides two forms of claims data at different stages of Medicare processing:

**Adjudicated claims** are fully processed and approved by Medicare. They provide the complete, final record of an episode of care. Available to all [eligible model entities](/).

**Partially adjudicated claims** haven't been fully processed yet but are available much sooner — typically 2-4 days after a provider submits the claim. Currently available to ACO REACH participants only. [Learn more about data freshness](./data-freshness).

| | Partially adjudicated | Fully adjudicated |
|---|---|---|
| **Availability** | 2-4 days after submission | ~14 days after submission |
| **Update frequency** | Daily | Weekly |
| **Eligible models** | ACO REACH only | All eligible model entities |
| **Data included** | Parts A and B (excluding DME) | Parts A, B, and D |

## How data is organized

Claims data is delivered as FHIR resources in NDJSON format. Each resource type contains a specific category of information:

| Resource type | What it contains | Update frequency |
|---|---|---|
| **ExplanationOfBenefit** | Episodes of care: where and when service was performed, diagnosis codes, provider, cost | Weekly |
| **Patient** | Enrollee demographics and identifiers | Weekly |
| **Coverage** | Insurance coverage details including dual coverage | Weekly |
| **Claim** | Professional and institutional claim details (partially adjudicated only) | Daily |
| **ClaimResponse** | Adjudication status and processing results (partially adjudicated only) | Daily |

::: info Confidentiality
In accordance with HIPAA and 42 CFR Part 2, substance use disorder records are confidential and excluded. BCDA also excludes data on enrollees who have opted out of data sharing.
:::

<!-- TODO: Asset missing — BCDA_Data_Dictionary.xlsx
For field-level detail, download the <DownloadLink file="/downloads/BCDA_Data_Dictionary.xlsx">Data Dictionary</DownloadLink> or explore [sample files](/data-dictionary/dictionary).
-->
