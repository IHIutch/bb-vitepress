# About DPC

## What does DPC give me?

Data at the Point of Care (DPC) gives healthcare providers access to their patients' Medicare Fee-For-Service claims data through an API. When your patients visit other providers — urgent care, hospitals, specialists, pharmacies — those visits generate claims. DPC lets you see that history: diagnoses, medications, procedures, and coverage information.

The data covers:

- **Part A** — hospital insurance: inpatient stays, skilled nursing, hospice
- **Part B** — medical insurance: doctor visits, outpatient care, preventive services, medical equipment
- **Part D** — prescription drugs filled through a Part D plan

Claims data goes back to **May 27, 2014**.

::: warning What DPC does NOT include
DPC does not provide clinical notes, lab results, or any claims with substance abuse codes (excluded per 42 CFR Part 2).
:::

## How is DPC different from BCDA and Blue Button?

DPC is one of several CMS APIs that share Medicare claims data in FHIR format. Here's how they compare:

| | DPC | BCDA | Blue Button 2.0 |
|---|---|---|---|
| **Who can use it** | Fee-for-Service providers | ACOs in the Medicare Shared Savings Program | Any registered application |
| **Data scope** | Provider's attributed patients | All beneficiaries assigned to the ACO | One beneficiary at a time |
| **Beneficiary consent** | Not required — data shared under HIPAA for treatment | Not required | Required — beneficiary authorizes the app |
| **Data format** | Bulk FHIR (NDJSON) | Bulk FHIR (NDJSON) | Individual FHIR resources |
| **Who initiates** | Provider identifies their own roster | ACO receives assigned beneficiaries | Beneficiary connects their data |

- [BCDA](https://bcda.cms.gov/) — Beneficiary Claims Data API
- [Blue Button 2.0](https://bluebutton.cms.gov/) — beneficiary-facing API
- [AB2D](https://ab2d.cms.gov/) — claims data for Prescription Drug Plan sponsors

## Current status

::: danger STATUS — Update needed
<!-- TODO: The most recent status update on the existing site is from July 2023. This section needs current information from the DPC program team. -->
The content below reflects the last published update (July 2023). Contact the [DPC Google Group](https://groups.google.com/g/dpc-api) for the latest status.
:::

Onboarding for production access is paused while the DPC team makes improvements to:

- Identity verification and credential assignment
- Validation with [PECOS](https://pecos.cms.hhs.gov/pecos/login.do#headingLv1) (Provider Enrollment, Chain, and Ownership System)
- Automation to make onboarding faster and easier

The [sandbox environment](https://sandbox.dpc.cms.gov/users/sign_in) remains available for testing.

### What this means for you

**Interested but haven't applied yet?** You can still [sign up for the sandbox](https://sandbox.dpc.cms.gov/users/sign_up) and build your integration.

**Already applied and waiting?** You'll keep your place in the onboarding queue.

**Already a pilot participant?** You can continue using the DPC API.

<details>
<summary>Previous updates</summary>

**July 2023** — Announced work on enhanced authentication, PECOS validation, and onboarding automation.

**May 2023** — Paused onboarding and new applications for production data to implement improved onboarding experience based on initial pilot group feedback.

</details>

## What does it cost?

There is no cost. DPC is a free service provided by CMS.

## Who can use it?

- **Fee-for-Service providers** who treat Medicare patients
- **Health IT vendors** working on behalf of those providers (as HIPAA business associates)
- Organizations that are either HIPAA **Covered Entities** or **Business Associates** as defined in 45 C.F.R. § 160.103

DPC is designed for providers who already work with claims data and want to integrate Medicare claims into their existing clinical workflows.

## What are the requirements?

To access production data, your software must hold at least one of these security certifications:

- ONC Health IT Certification
- HITRUST CSF Validated Assessment
- EHNAC Accreditation (various programs)
- SOC 2 (Type 2 or Type 1 if pursuing Type 2)
- ISO 27001, 27017, or 27018

You must also comply with HIPAA requirements for handling Protected Health Information (PHI). Data may only be requested for treatment purposes under 45 C.F.R. § 164.506.

For the full legal terms, see the [Terms of Service](/production/terms-of-service).

## Resources

<!-- TODO: Asset missing — dpc-one-pager.pdf
- [DPC One-Pager (PDF)](/downloads/dpc-one-pager.pdf) — shareable overview for your team
-->
- [DPC Google Group](https://groups.google.com/d/forum/dpc-api) — community forum for questions and updates
- [Sandbox sign-up](https://sandbox.dpc.cms.gov/users/sign_up) — start testing today
- [Documentation](/guide/) — technical guide for developers
