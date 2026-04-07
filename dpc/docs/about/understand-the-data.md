# Understand the Data

Before you write any code, it helps to know what DPC sends back and what it means.

When you export data for a patient, you get three types of files in [NDJSON](https://github.com/ndjson/ndjson-spec) format (one JSON object per line):

- **Patient** — demographics: name, date of birth, gender, Medicare Beneficiary Identifier (MBI)
- **Coverage** — insurance enrollment: which parts of Medicare the patient is enrolled in (Part A, Part B, Part D)
- **Explanation of Benefit (EoB)** — claims history: diagnoses, procedures, medications, providers seen, dates of service, and payment details

These files use the [FHIR](https://www.hl7.org/fhir/) standard — a specification for exchanging healthcare data electronically, developed by HL7. DPC specifically uses the [Bulk FHIR specification](https://hl7.org/fhir/uv/bulkdata/), which allows you to request data for all of a provider's patients at once.

## Patient resource

A Patient resource contains the beneficiary's demographics and identifiers. Here is a trimmed example:

```json{2,6,13,22,26}
{
  "resourceType": "Patient",
  "id": "-10000000000066",
  "meta": {
    "lastUpdated": "2021-08-17T13:43:00.037-04:00"
  },
  "identifier": [
    {
      "system": "https://bluebutton.cms.gov/resources/variables/bene_id",
      "value": "-10000000000066"
    },
    {
      "system": "http://hl7.org/fhir/sid/us-mbi",
      "value": "1S00E00AA66"
    }
  ],
  "name": [
    {
      "use": "usual",
      "family": "Schneider199",
      "given": ["Werner409"]
    }
  ],
  "gender": "male",
  "birthDate": "1952-11-17",
  "address": [
    {
      "state": "22"
    }
  ]
}
```

Key fields:

1. **`resourceType`** — always `"Patient"` for this resource type.
2. **`identifier`** — contains the Medicare Beneficiary Identifier (MBI) under the `us-mbi` system. This is the primary ID you'll use to match patients. The `bene_id` is an internal CMS identifier.
3. **`meta.lastUpdated`** — when this record was last updated in the data source. Used with the `_since` parameter for incremental exports.
4. **`name`** — the beneficiary's name. `family` is last name, `given` is an array of first/middle names.
5. **`gender`** and **`birthDate`** — used by CMS to verify patient identity. The gender field must match CMS records when you register patients.

## Coverage resource

A Coverage resource describes the patient's Medicare enrollment — which parts they're covered under and their current status.

```json{2,5,10,15,20}
{
  "resourceType": "Coverage",
  "id": "part-a--10000000000066",
  "status": "active",
  "beneficiary": {
    "reference": "Patient/-10000000000066"
  },
  "type": {
    "coding": [
      {
        "system": "Medicare",
        "code": "Part A"
      }
    ]
  },
  "grouping": {
    "subGroup": "Medicare",
    "subPlan": "Part A"
  },
  "extension": [
    {
      "url": "https://bluebutton.cms.gov/resources/variables/ms_cd",
      "valueCoding": {
        "code": "20",
        "display": "Disabled without ESRD"
      }
    }
  ]
}
```

Key fields:

1. **`resourceType`** — always `"Coverage"`.
2. **`status`** — whether the coverage is `active` or `cancelled`.
3. **`beneficiary.reference`** — links this coverage to a Patient resource by ID.
4. **`type` / `grouping`** — which part of Medicare: Part A (hospital insurance), Part B (medical insurance), or Part D (prescription drug coverage). You'll typically see separate Coverage resources for each part.
5. **`extension`** — CMS-specific data like Medicare status code (`ms_cd`). The `display` value provides a human-readable description.

## Explanation of Benefit resource

An Explanation of Benefit (EoB) resource is the richest data type — it represents a single claim. This is where you'll find diagnoses, procedures, providers, and payment details. EoB resources are large; here is a trimmed example showing the most useful sections:

```json{2,6,14,28,42}
{
  "resourceType": "ExplanationOfBenefit",
  "billablePeriod": {
    "start": "2020-03-13",
    "end": "2020-03-22"
  },
  "diagnosis": [
    {
      "sequence": 1,
      "diagnosisCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/sid/icd-10",
            "code": "J208",
            "display": "ACUTE BRONCHITIS DUE TO OTHER SPECIFIED ORGANISMS"
          }
        ]
      },
      "type": [
        {
          "coding": [
            {
              "code": "admitting"
            }
          ]
        }
      ]
    }
  ],
  "careTeam": [
    {
      "sequence": 3,
      "provider": {
        "identifier": {
          "system": "http://hl7.org/fhir/sid/us-npi",
          "value": "9999994996"
        }
      },
      "role": {
        "coding": [
          {
            "code": "primary",
            "display": "Primary provider"
          }
        ]
      }
    }
  ],
  "benefitBalance": [
    {
      "category": {
        "coding": [
          {
            "code": "medical",
            "display": "Medical Health Coverage"
          }
        ]
      }
    }
  ]
}
```

Key fields:

1. **`resourceType`** — always `"ExplanationOfBenefit"`.
2. **`billablePeriod`** — the date range for the service. `start` is when the service began, `end` is when it concluded.
3. **`diagnosis`** — an array of diagnoses associated with the claim. Each entry includes an ICD-10 code, a human-readable description, and a type (admitting, principal, etc.). This is where you'll see conditions diagnosed at other providers.
4. **`careTeam`** — the providers involved in the service, identified by NPI (National Provider Identifier). The `role` indicates whether they were the primary provider, an assisting provider, etc.
5. **`benefitBalance`** — financial summary of the claim, including coverage category and utilization counts.

::: tip
A single patient may have dozens or hundreds of EoB resources — one per claim. When working with bulk exports, expect EoB files to be significantly larger than Patient or Coverage files.
:::

## Data scope and limitations

DPC provides Medicare Fee-For-Service claims data going back to **May 27, 2014**. The data includes:

- **Part A** — hospital insurance: inpatient stays, skilled nursing, hospice, some home health
- **Part B** — medical insurance: doctor visits, outpatient care, medical equipment, preventive services
- **Part D** — prescription drug coverage: medications filled through a Part D plan

For each beneficiary, you receive claims for all services covered by Parts A and B that were provided and processed during the prior month, plus Part D prescriptions.

::: warning What DPC does NOT include
- Clinical notes
- Lab results
- Substance abuse codes (excluded per 42 CFR Part 2)
:::

::: danger Be wary of data from before February 12, 2020
Due to limitations in the Beneficiary FHIR Data (BFD) Server, data from before 02-12-2020 is marked with an arbitrary `lastUpdated` date of 01-01-2020. If you use the `_since` parameter with dates between 01-01-2020 and 02-11-2020, you will receive all historical data for your beneficiaries. Data from 02-12-2020 onward has accurate dates.
:::

## Sample files

Download these synthetic data files to explore the structure before connecting to the API:

<!-- TODO: Asset missing — ExplanationOfBenefit.ndjson, Patient.ndjson, Coverage.ndjson
- [Explanation of Benefit](/downloads/ExplanationOfBenefit.ndjson)
- [Patient](/downloads/Patient.ndjson)
- [Coverage](/downloads/Coverage.ndjson)
-->

These files contain synthetic (fake) data, but the structure matches what you'll receive from the production API.

## Additional resources

- [FHIR / HL7 specification](https://www.hl7.org/fhir/)
- [Bulk FHIR specification](https://hl7.org/fhir/uv/bulkdata/)
- [Beneficiary FHIR Data Server (BFD) / Blue Button API](https://bluebutton.cms.gov/developers/)
- [Intro to JSON format](https://www.json.org/json-en.html) and [NDJSON](https://github.com/ndjson/ndjson-spec)
- [JSON format viewer / validator](https://jsonlint.com/)
- [Intro to valid FHIR formats](http://hl7.org/fhir/STU3/validation.html)
