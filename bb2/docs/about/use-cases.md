---
title: Use Cases
description: See how teams use Blue Button to build health apps, plan finders, research tools, and more.
---

# Use Cases

Blue Button data powers apps across healthcare — from personal health tools to clinical research platforms. Here's how teams are using it and how you'd build something similar.

## Personal health aggregators

**What it does:** Gives Medicare enrollees a single view of their health data across all providers. Claims, prescriptions, diagnoses, and costs in one place.

**Why it matters:** Thirty percent of Medicare enrollees have 2-3 chronic conditions and see 5+ physicians annually. When health data is scattered across providers, things get missed — redundant tests, conflicting prescriptions, gaps in care.

**How you'd build it:**
- Fetch [Patient](/api-reference/patient.md) for demographics and [ExplanationOfBenefit](/api-reference/explanation-of-benefit.md) for all claims
- Parse claim types to categorize by provider visits, hospital stays, and prescriptions
- Use diagnosis codes (ICD-10) and procedure codes (HCPCS) to build a health timeline
- Use `_lastUpdated` to sync new claims incrementally

**API resources used:** Patient, Coverage, ExplanationOfBenefit

---

## Insurance plan finders

**What it does:** Recommends Medicare plans based on an enrollee's actual claims history — not just generic plan comparison, but personalized guidance based on their doctors, prescriptions, and utilization patterns.

**Why it matters:** Choosing the right Medicare plan is complex. With claims data, you can estimate actual costs under different plans instead of relying on guesswork.

**How you'd build it:**
- Fetch [ExplanationOfBenefit](/api-reference/explanation-of-benefit.md) to get claims history
- Filter by `type=pde` for prescription data — use NDC codes to identify drugs and estimate costs
- Extract provider NPIs from `careTeam` to check network status across plans
- Use [Coverage](/api-reference/coverage.md) to understand current plan enrollment

**API resources used:** ExplanationOfBenefit (especially PDE claims), Coverage

---

## Clinical research tools

**What it does:** Automates data collection for clinical trials and health studies. Instead of participants filling out forms or submitting records manually, they authorize access and their claims data flows in automatically.

**Why it matters:** Manual data entry is slow, error-prone, and burdensome for participants. Automated claims data collection improves data quality and reduces participant dropout.

**How you'd build it:**
- Implement [OAuth consent flow](/guide/building-a-consent-flow.md) with clear explanation of research purposes
- Fetch all claim types to build a comprehensive patient history
- Use `_lastUpdated` for ongoing data collection over the study period
- Store data securely — research data has additional compliance requirements

**API resources used:** Patient, ExplanationOfBenefit, Coverage

---

## Health record sharing

**What it does:** Lets Medicare enrollees share their health data with doctors, pharmacies, caregivers, or anyone they choose. Think of it as a portable health record powered by claims data.

**Why it matters:** When patients move between providers, their health history doesn't always follow. Claims data provides a baseline — current medications, recent visits, diagnoses — that helps new providers get up to speed quickly.

**How you'd build it:**
- Fetch [Patient](/api-reference/patient.md) and [ExplanationOfBenefit](/api-reference/explanation-of-benefit.md)
- Extract medications from PDE claims, diagnoses from all claim types
- Build a shareable summary — recent visits, active conditions, current medications
- Consider integration with EHR systems using FHIR standards

**API resources used:** Patient, ExplanationOfBenefit

---

## See live apps

For examples of apps currently using Blue Button, visit the [Blue Button app directory on Medicare.gov](https://www.medicare.gov/providers-services/claims-appeals-complaints/claims/share-your-medicare-claims/connected-apps).

## Ready to build?

Start with the [Quickstart](/quickstart) to get your first API response in 5 minutes.
