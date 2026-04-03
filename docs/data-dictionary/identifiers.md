---
title: Identifiers
description: Business identifiers used in Blue Button API responses — MBI, HICN, and claim group.
---

# Identifiers

Identifiers are business-level IDs that appear in Blue Button responses. Unlike FHIR resource IDs (which are internal system IDs), identifiers represent real-world numbers like the Medicare Beneficiary ID on someone's Medicare card.

## How identifiers work

An identifier in FHIR includes a `system` (which identifier scheme it belongs to) and a `value`:

```json
{
  "identifier": [
    {
      "system": "http://hl7.org/fhir/sid/us-mbi",
      "value": "1S00-E00-AA00"
    }
  ]
}
```

The `system` URI tells you what kind of identifier you're looking at. The `value` is the actual ID.

## Blue Button identifiers

| Identifier | System URI | Description | Found in |
|------------|-----------|-------------|----------|
| [MBI Hash](../resources/identifier/mbi-hash) | `https://bluebutton.cms.gov/resources/identifier/mbi-hash` | Hashed Medicare Beneficiary ID | Patient |
| [HICN Hash](../resources/identifier/hicn-hash) | `https://bluebutton.cms.gov/resources/identifier/hicn-hash` | Hashed Health Insurance Claim Number (legacy) | Patient |
| [Claim Group](../resources/identifier/claim-group) | `https://bluebutton.cms.gov/resources/identifier/claim-group` | Groups related claim lines together | ExplanationOfBenefit |

## Medicare Beneficiary ID (MBI)

The MBI is the primary identifier for Medicare enrollees — it's the number on their Medicare card. In Blue Button responses, the MBI appears in the Patient resource's `identifier` array with the system `http://hl7.org/fhir/sid/us-mbi`.

A patient may have multiple MBIs (current and historic). Use the `identifier-currency` extension to determine which is current. See [Working with identifiers](../guides/fetching-patient-data.md#work-with-identifiers) for details and code examples.

## HICN (legacy)

The Health Insurance Claim Number was the previous Medicare identifier, replaced by the MBI. Blue Button provides a hashed version for backwards compatibility. New integrations should use the MBI.

## Claim Group ID

The claim group identifier links related lines within a claim. Multiple EOB line items that belong to the same claim share the same claim group ID.
