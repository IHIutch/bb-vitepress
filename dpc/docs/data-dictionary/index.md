---
title: Data Dictionary
description: FHIR resource types returned by the DPC API, including Patient, Coverage, and ExplanationOfBenefit.
---

# Data Dictionary

When you export data from DPC, you receive three FHIR resource types in [NDJSON](https://github.com/ndjson/ndjson-spec) format:

| Resource type | What it contains |
|---|---|
| **Patient** | Demographics: name, date of birth, gender, Medicare Beneficiary Identifier (MBI) |
| **Coverage** | Insurance enrollment: which parts of Medicare the patient has (A, B, D) and current status |
| **ExplanationOfBenefit** | Claims history: diagnoses, procedures, medications, providers, dates of service, and payment details |

For detailed examples with annotated JSON and key field explanations, see [Understand the Data](/about/understand-the-data).

## Data scope

DPC provides Medicare Fee-For-Service claims data going back to **May 27, 2014**, covering:

- **Part A** — hospital insurance: inpatient stays, skilled nursing, hospice, some home health
- **Part B** — medical insurance: doctor visits, outpatient care, medical equipment, preventive services
- **Part D** — prescription drug coverage: medications filled through a Part D plan

::: warning What DPC does NOT include
Clinical notes, lab results, or substance abuse codes (excluded per 42 CFR Part 2).
:::

## Sample files

Download synthetic data files to explore the structure before connecting to the API:

<!-- TODO: Asset missing — ExplanationOfBenefit.ndjson, Patient.ndjson, Coverage.ndjson
- [ExplanationOfBenefit](/downloads/ExplanationOfBenefit.ndjson)
- [Patient](/downloads/Patient.ndjson)
- [Coverage](/downloads/Coverage.ndjson)
-->

## Additional resources

- [FHIR / HL7 specification](https://www.hl7.org/fhir/)
- [Bulk FHIR specification](https://hl7.org/fhir/uv/bulkdata/)
- [NDJSON specification](https://github.com/ndjson/ndjson-spec)
