---
title: Migrate from v1 to v2
description: Actionable guide for migrating from BCDA v1 (STU3) to v2 (R4), including renamed fields and changed constraints.
---

# Migrate from v1 to v2

BCDA v1 uses [FHIR STU3](https://hl7.org/fhir/STU3/) based on the Blue Button Implementation Guide. v2 uses [FHIR R4](https://hl7.org/fhir/R4/) based on the [CARIN Blue Button Implementation Guide](https://www.hl7.org/fhir/us/carin-bb/). v2 is also required for [partially adjudicated claims data](/about/data-freshness).

**You do not need new credentials.** The same credentials work for both v1 and v2 in sandbox and production.

## Change your endpoint URLs

Replace `v1` with `v2` in all API URLs:

| Before | After |
|---|---|
| `/api/v1/Group/all/$export` | `/api/v2/Group/all/$export` |
| `/api/v1/Patient/$export` | `/api/v2/Patient/$export` |
| `/api/v1/jobs/{id}` | `/api/v2/jobs/{id}` |
| `/api/v1/metadata` | `/api/v2/metadata` |

## Update your parsers

### ExplanationOfBenefit (EOB)

**Renamed fields** — Update any parsing logic that references these:

| v1 (STU3) | v2 (R4) | Action |
|---|---|---|
| `Eob.information` | `Eob.supportingInfo` | Rename in parser |
| `Eob.careTeamLinkId` | `Eob.careTeamSequence` | Rename in parser |
| `Eob.diagnosisLinkId` | `Eob.diagnosisSequence` | Rename in parser |
| `Eob.service` | `Eob.productOrService` | Rename in parser |

**Consolidated fields** — Two v1 elements merged into one:

| v1 (STU3) | v2 (R4) | Action |
|---|---|---|
| `Eob.organization` and `Eob.provider` | `Eob.provider` | Use `Eob.provider` only |
| `Eob.hospitalization` | Removed | Remove from parser if present |

**New required fields** — 15 fields changed from optional to mandatory. If you already consume these fields, no action needed. If your parser rejects unexpected fields, update your schema. Examples: `Eob.use`, `Eob.patient`, `Eob.outcome`.

**New elements** — ~35 new elements added, mostly child elements of `.addItem` (not supplied by BCDA). No action needed unless you want to consume new data.

**Value set changes** — Some fields are now bound to CARIN or HL7 value sets instead of Blue Button:
- `Patient.identifier.type` → bound to [C4BB Patient Identifier Type](https://www.hl7.org/fhir/us/carin-bb/ValueSet-C4BBPatientIdentifierType.html)
- `EOB.type` → bound to [C4BB Payee Type](https://www.hl7.org/fhir/us/carin-bb/ValueSet-C4BBPayeeType.html)

### Patient

Minimal changes. The Patient resource is normative (maturity level 5).

- `Patient.animal` was removed (no effect on BCDA data)
- Minor value set and reference target changes for `Patient.active`, `Patient.gender`, `Patient.generalPractitioner`

**Action:** No parser changes required unless you reference `Patient.animal`.

### Coverage

**Renamed field:** `Coverage.grouping` is renamed to `Coverage.class`. Update your parser to read plan type and group from the new location.

**New elements:** 6 added, mostly related to `costToBeneficiary` (not supplied by BCDA). No action needed.

**Changed constraints:** Minor changes to `Coverage.beneficiary` and `Coverage.payor`. No action needed.

## Full reference

See the R3 Diff in the [FHIR ExplanationOfBenefit specification](https://www.hl7.org/fhir/explanationofbenefit.html#resource) for a complete list of changes.
