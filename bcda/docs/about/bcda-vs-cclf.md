---
title: BCDA vs CCLF
description: Compare BCDA and Claim and Claim Line Feed files to decide which data source is right for your organization.
---

# BCDA vs CCLF

Both BCDA and [Claim and Claim Line Feed (CCLF)](https://www.cms.gov/files/document/cclf-information-packet.pdf) files provide Medicare Parts A, B, and D claims data. They differ in format, delivery method, and update frequency. Your organization can use either or both.

## At a glance

| | BCDA | CCLF |
|---|---|---|
| **Access method** | Programmatic API requests | Portal download, API, or CLI |
| **Data format** | FHIR R4 (or STU3), NDJSON | Fixed-width flat files |
| **Adjudicated claims** | Updated weekly | Available monthly (weekly upon request) |
| **Partially adjudicated claims** | Updated daily | Not available |
| **Supported models** | SSP, ACO REACH, KCC | SSP, ACO REACH, KCC, Vermont All-Payer, Primary Care First |
| **Data source** | CCW (adjudicated), FISS/MCS (partially adjudicated) | Integrated Data Repository (IDR) |

## Which should you use?

**Choose BCDA if** your organization wants to automate data retrieval, needs data more frequently than monthly, or wants to receive partially adjudicated claims for earlier intervention. The FHIR format integrates well with existing data models and EHR systems.

**Choose CCLF if** your organization prefers portal-based downloads, needs data from models BCDA doesn't support (Vermont All-Payer, Primary Care First), or relies on fixed-width file formats in existing workflows.

## Can you use both?

Yes. Using both sources provides several benefits:

- **Ensure data accuracy** — Cross-reference both sources to identify discrepancies and access a wider range of historical data
- **Understand utilization patterns** — Combine CCLF enrollment data (start/end dates, coverage type, demographics) with BCDA data for population health management and risk stratification
- **Evaluate care coordination** — Combine BCDA insurance coverage details with CCLF payment data to assess coordination of benefits and identify primary or secondary payers

## Data source differences

CCLF files come from the Integrated Data Repository (IDR) monthly. BCDA gets adjudicated claims from the Chronic Conditions Data Warehouse (CCW) weekly, and partially adjudicated claims from FISS and MCS daily.

Since CCW and IDR refresh at different rates, minor data discrepancies can occur. Both systems modify data elements differently — IDR has expanded fields for enterprise functioning, while CCW structures data for research use.

<!-- TODO: Asset missing — BCDA_Data_Dictionary.xlsx, unmapped-fields-between-cclf-and-bcda.xlsx
For field-level mapping between BCDA and CCLF, download the <DownloadLink file="/downloads/BCDA_Data_Dictionary.xlsx">Data Dictionary</DownloadLink> or the <DownloadLink file="/downloads/unmapped-fields-between-cclf-and-bcda.xlsx">unmapped fields reference</DownloadLink>.
-->

## Historical data for newly attributed enrollees

The amount of historical data for newly attributed enrollees differs by model and source:

| Model | BCDA | CCLF |
|---|---|---|
| **SSP** | All data as far back as 2014 | 36 months prior to agreement start |
| **KCC** | 24 months from performance year start | 36 months from performance year start |
| **ACO REACH** | 36 months from performance year start | 36 months from performance year start |
