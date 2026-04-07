---
title: How Fresh the Data Is
description: BCDA provides partially adjudicated claims in 2-4 days and fully adjudicated claims in about 14 days after submission.
---

# How fresh the data is

Most Medicare claims data sources deliver data weeks after a provider submits a claim. BCDA can deliver partially adjudicated claims in as few as 2-4 days.

## Claims data timeline

After a Medicare enrollee receives care, their provider submits a claim. Here's how quickly that data reaches your organization through BCDA:

1. **Medicare enrollee receives care** — Provider submits a claim to Medicare
2. **2-4 days after submission** — BCDA shares partially adjudicated claims data (ACO REACH only). These claims haven't been fully processed yet but contain valuable clinical and service data.
3. **Medicare approves the claim** — The claim goes through full adjudication
4. **~14 days after submission** — BCDA shares fully adjudicated claims data (all eligible model entities). This is the complete, final record.

<!-- TODO: Asset missing — adjudication-data-flow.svg
![Claims data flow diagram](/img/adjudication-data-flow.svg)
-->

## Where the data comes from

BCDA sources data from multiple CMS systems:

- **Adjudicated claims** come from the [Chronic Conditions Data Warehouse (CCW)](https://www2.ccwdata.org/web/guest/home) and are refreshed every weekend
- **Partially adjudicated claims** come from the Fiscal Intermediary Standard System (FISS) and Multi-Carrier System (MCS) and are refreshed daily

::: info Data delays
If there's a delay in the weekly data refresh, the BCDA team posts updates in the [Google Group](https://groups.google.com/g/bc-api).
:::

## How often to export data

BCDA updates adjudicated claims weekly and partially adjudicated claims daily. We recommend:

- **Adjudicated claims**: Export no more than once per week
- **Partially adjudicated claims**: Export no more than once per day

Use the [_since parameter](/guide/filtering#the-_since-parameter) to avoid downloading duplicate data. You can use the `transactionTime` from your most recent job as the start date for the next request.

## What is claims adjudication?

Adjudication is Medicare's process of reviewing and approving claims submitted by healthcare providers. It involves submission, validation, clinical review, and payment approval. A claim may go through multiple rounds of processing and adjustment before it reaches its final status.

Partially adjudicated claims are valuable because they give your organization early visibility into enrollee activity — allowing faster follow-up and intervention — even before the claim is fully processed. Once adjudication completes, the same claim appears in fully adjudicated data with the final approved details.

## Claims submission deadlines

Per Section 6404 of the Affordable Care Act, Medicare Fee-for-Service claims must be submitted within 12 months of the date of service. [Learn about claims submission and approval timeframes](https://www2.ccwdata.org/documents/10280/19002256/medicare-claims-maturity.pdf).
