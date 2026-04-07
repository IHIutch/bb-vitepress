---
description: Learn what data AB2D provides, how claims work, what you can and cannot do with the data, and download sample files.
---

# About the Data

The AB2D API shares Medicare Parts A and B claims data with active, stand-alone Prescription Drug Plan (PDP) sponsors. Also known as Part D sponsors, these are insurers that deliver Part D benefits to Medicare enrollees.

## What you get

- **Medicare Part A** — Inpatient hospital stays, care in skilled nursing facilities, hospice care, and home health
- **Medicare Part B** — Physicians' services, outpatient care, medical supplies, and preventive services

Data elements include:

- Enrollee identifiers (Medicare Beneficiary Identifier)
- Diagnosis and procedure codes (ICD-10, HCPCS)
- Dates and places of service
- National Provider Identifier (NPI) numbers
- Claim processing and linking identifiers (claim ID, claim type code)

AB2D uses [FHIR R4](https://hl7.org/fhir/R4/) and exports data in [NDJSON format](https://github.com/ndjson/ndjson-spec). The data source is the [Chronic Conditions Warehouse (CCW)](https://www2.ccwdata.org/web/guest/home/).

### Downloads

- [Data Dictionary (XLSX)](/downloads/ab2d-data-dictionary.xlsx) — detailed breakdown of all data elements for v2 (R4) and v1 (STU3)
- [Sample export — v2 FHIR R4 (NDJSON)](/downloads/sample-data-r4.ndjson)
- [Sample export — v1 FHIR STU3 (NDJSON)](/downloads/sample-data-stu3.ndjson)
- [Using AB2D Medical Claims Data for Medicare Part D MTM Programs (PDF)](/downloads/ab2d-mtm-white-paper.pdf)

## Understanding claims data

### Important claim fields

| Field | Description | EOB location |
|---|---|---|
| **Claim Group ID** | Unique identifier of a claim, the same across all versions. Groups a "family" of related claim objects. | `eob.identifier` list |
| **Claim ID** | Unique identifier of a single version of a claim. Changes with each update. | `eob.identifier` list |
| **Claim Status** | Either `active` (latest version) or `canceled` (superseded or revoked). | `eob.status` |
| **Last Updated** | When AB2D last received a modification to the claim. | `eob.meta.lastUpdated` |
| **MBI** | Medicare Beneficiary Identifier. Can be current or historic. | `eob.extension` |

### Claims vs. claim objects

Each claim made by a provider becomes an immutable **claim object** in AB2D's data source. Any change creates a completely new claim object — a new "version." AB2D provides all versions, not just the latest.

Key rules:

- AB2D reports **all** claim objects, including older versions.
- Only the latest version has `Claim Status = active`. All others are `canceled`.
- Updates can create new claim objects at any time.
- **Your organization is responsible for determining the most recent claim object.**

### Claim versioning

Two identifiers track the relationship between a business claim and its versions:

- **Claim Group ID** — Stays the same across all versions. Groups the "family."
- **Claim ID** — Changes with each new version.

**Example:** A claim arrives on January 1 (Claim Group ID: 99995, Claim ID: 321). On February 1, it is updated with an additional line item. The update creates a new claim object (Claim Group ID: 99995, Claim ID: 789). The Claim Group ID stays the same; the Claim ID changes.

| Claim Group ID | Last Updated | Claim ID | Claim Lines | Status |
|---|---|---|---|---|
| 99995 | 01/01/2020 | 321 | ABCD, DEFG, HIJK | canceled |
| 99995 | 02/01/2020 | 789 | ABCD, DEFG, HIJK, LMNO | active |

::: info
"Claim version" is not a field in the data. It is a conceptual label used here for clarity.
:::

### Detecting updated claims

To detect updates, track these fields for each claim:

1. **Claim Group ID** — same across all versions
2. **Claim ID** — unique per version
3. **Last Updated** — when the change was received
4. **Claim Status** — `active` or `canceled`

When you see a Claim Group ID with multiple Claim IDs, only the one marked `active` is the latest. If all versions are `canceled`, the entire claim is revoked.

::: warning
When a claim is updated, the **old** version also gets a new `Last Updated` date (because its status changed to `canceled`). This means old versions can reappear in incremental exports. Use Claim Group ID + Claim ID to deduplicate.
:::

<details>
<summary>Detailed example: tracking a claim through multiple exports</summary>

A claim (Claim Group ID 99995) evolves through 3 updates:

1. **Jan 1, 2020** — Original claim received (Claim ID: 12987987)
2. **Feb 10, 2020** — Updated with additional line item (Claim ID: 54689123). Old version marked `canceled`.
3. **Mar 31, 2020** — Updated again, line item removed (Claim ID: 34543). Previous version marked `canceled`.

**Export 1** (Jan 1–31, `_since=2020-01-01`): Returns Claim ID 12987987 with status `active`.

**Export 2** (Jan 31–Feb 28, `_since=2020-01-31`): Returns **both**:
- Claim ID 12987987 (now `canceled`, Last Updated changed to Feb 10)
- Claim ID 54689123 (`active`, received Feb 10)

The old version reappears because its `Last Updated` changed when its status flipped to `canceled`.

**Export 3** (Feb 28–Mar 31, `_since=2020-02-28`): Returns **both**:
- Claim ID 54689123 (now `canceled`, Last Updated changed to Mar 31)
- Claim ID 34543 (`active`, received Mar 31)

**Takeaway:** Always check Claim Group ID + Claim ID together. A claim you have already downloaded may reappear with an updated status.

</details>

### Identifying patients

Each claim contains a **Medicare Beneficiary Identifier (MBI)** to map it to a patient. AB2D reports all MBIs — both current and historic.

- **Current MBI** — The active MBI for a patient
- **Historic MBI** — A previously used MBI for the same patient

The MBI is found in the `eob.extension` list. An extension field called `identifier-currency` indicates whether the MBI is `current` or `historic`.

<details>
<summary>Example: MBI in EOB JSON</summary>

```json
{
  "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-identifier",
  "valueIdentifier": {
    "extension": [
      {
        "url": "https://bluebutton.cms.gov/resources/codesystem/identifier-currency",
        "valueCoding": {
          "code": "current"
        }
      }
    ],
    "system": "http://hl7.org/fhir/sid/us-mbi",
    "value": "7S94E00AA00"
  }
}
```

For a historic MBI, the `code` value would be `"historic"` instead of `"current"`.

</details>

<details>
<summary>Example: Claim Group ID and Claim ID in EOB JSON</summary>

```json
"identifier": [
  {
    "system": "https://bluebutton.cms.gov/resources/variables/clm_id",
    "value": "10000521860"
  },
  {
    "system": "https://bluebutton.cms.gov/resources/identifier/claim-group",
    "value": "7653956538"
  }
]
```

The Claim ID uses the `clm_id` system. The Claim Group ID uses the `claim-group` system.

</details>

::: info
Sandbox test data contains only negative Patient IDs.
:::

## What you can do with it

### Target MTM program enrollees

AB2D data helps identify enrollees who may be eligible for [Medication Therapy Management (MTM)](https://www.cms.gov/medicare/coverage/prescription-drug-coverage-contracting/medication-therapy-management) programs. You can use diagnosis and procedure codes to find enrollees who meet MTM targeting criteria, such as those with certain chronic diseases.

### Enhance MTM consultations

With a holistic view of enrollees' health histories, MTM providers and enrollees can have more informed discussions during medication reviews:

- Promote safe and effective medication use
- Prevent gaps in medication therapies
- Identify appropriate medication alternatives
- Reduce adverse drug events or interactions
- Enhance coordination of care across providers and pharmacists

### Boost health outcomes

Part D [Star Ratings](https://www.cms.gov/medicare/health-drug-plans/part-c-d-performance-data) evaluate the quality of services enrollees receive. CMS offers incentives to PDP sponsors with high ratings, including year-round marketing for 5-star plans. AB2D data can improve medication adherence — a key Star Ratings quality measure — by proactively identifying enrollees who may benefit from targeted intervention.

### Prevent fraud, waste, and abuse

AB2D data helps detect suspicious patterns from providers or suppliers, including duplicate billing, services misaligned with enrollee histories, opioid overutilization, and cost outliers.

::: info
According to the [final rule](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745), AB2D data cannot be used to influence coverage determinations. Fraud and abuse detection is limited to providers and suppliers.
:::

## What you cannot do with it

The [final rule](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745) prohibits the following uses:

1. **Inform coverage determinations** under Part D
2. **Conduct retroactive reviews** of medically accepted indication(s) determinations
3. **Facilitate enrollment changes** to a different prescription drug plan or an MA-PD plan offered by the same parent organization
4. **Inform marketing** of benefits

## History

The Centers for Medicare & Medicaid Services (CMS) developed AB2D in accordance with the [Bipartisan Budget Act of 2018](https://www.congress.gov/bill/115th-congress/house-bill/1892/text) and the [final rule](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745), which require sharing claims data with PDP sponsors that have active contracts. AB2D uses the [FHIR](https://hl7.org/fhir/R4/) standard for efficient and secure healthcare data exchange.
