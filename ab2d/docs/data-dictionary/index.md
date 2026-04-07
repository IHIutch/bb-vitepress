---
description: AB2D data elements, downloadable data dictionary, and sample export files.
---

# Data Dictionary

AB2D exports Medicare Parts A and B claims data as [FHIR R4](https://hl7.org/fhir/R4/) ExplanationOfBenefit (EOB) resources in [NDJSON format](https://github.com/ndjson/ndjson-spec).

## Data elements

Each claim includes:

- **Enrollee identifiers** — Medicare Beneficiary Identifier (MBI) — current and historic
- **Diagnosis codes** — ICD-10 codes with sequence and type (admitting, principal)
- **Procedure codes** — HCPCS codes for services rendered
- **Service details** — Dates, place of service, provider NPI
- **Claim metadata** — Claim Group ID, Claim ID, claim status, last updated date

For details on how claims are versioned and how to track updates, see [About the Data — Understanding Claims](/about/#understanding-claims-data).

## Downloads

- <a href="/downloads/ab2d-data-dictionary.xlsx">Data Dictionary (XLSX)</a> — detailed breakdown of all data elements for v2 (R4) and v1 (STU3)
- <a href="/downloads/sample-data-r4.ndjson">Sample export — v2 FHIR R4 (NDJSON)</a>
- <a href="/downloads/sample-data-stu3.ndjson">Sample export — v1 FHIR STU3 (NDJSON)</a>
- <a href="/downloads/ab2d-mtm-white-paper.pdf">Using AB2D Medical Claims Data for Medicare Part D MTM Programs (PDF)</a>

## Additional resources

- [FHIR R4 ExplanationOfBenefit](https://hl7.org/fhir/R4/explanationofbenefit.html)
- [NDJSON specification](https://github.com/ndjson/ndjson-spec)
- [Intro to JSON](https://json.org/)
