---
title: Why Blue Button
description: What data Blue Button provides, who it covers, and what you can build with it.
---

# Why Blue Button

Blue Button gives your app access to Medicare claims data for over 64 million people. When a Medicare enrollee authorizes your app, you receive their Part A (hospital), Part B (outpatient/physician), and Part D (prescription drug) claims — structured as FHIR resources and delivered through a RESTful API.

## What data you get

Blue Button delivers three FHIR resources per authorized patient:

- **Patient** — Demographics — name, date of birth, address, Medicare identifier
- **Coverage** — Insurance coverage — plan type, eligibility periods, payer information
- **ExplanationOfBenefit** — Claims — every processed claim including diagnoses, procedures, providers, costs, and adjudication details

Claims data comes from the CMS Chronic Conditions Warehouse (CCW) and includes the most recent 36+ months of history.

## Who it covers

Blue Button serves data for everyone enrolled in Medicare fee-for-service (Parts A and B) and Part D prescription drug plans. That's over 64 million people — roughly one in five Americans.

## What you can build

Teams use Blue Button to build apps that help Medicare enrollees understand and act on their health data:

- **Health data aggregators** — Give enrollees a single view of their claims across providers. Thirty percent of Medicare enrollees have 2-3 chronic conditions and see 5+ physicians annually. Centralized data helps them coordinate care.
- **Plan finders** — Use claims and prescription history to recommend optimal Medicare plan options. Estimate costs, check provider networks, and compare coverage.
- **Research tools** — Reduce manual data entry in clinical trials and health studies. Participants authorize access, and their claims flow in automatically.
- **Care coordination** — Help caregivers and providers share health information like current medications, visit history, and diagnoses.

For live examples, see the [Blue Button app directory on Medicare.gov](https://www.medicare.gov/providers-services/claims-appeals-complaints/claims/share-your-medicare-claims/connected-apps).

## How it works

Blue Button uses OAuth 2.0. A Medicare enrollee logs into Medicare.gov through your app, grants consent, and you receive an access token. Use that token to fetch their Patient, Coverage, and ExplanationOfBenefit resources. Data is returned as FHIR R4 JSON.

The [Quickstart](/quickstart) walks you through the full flow in 5 minutes.

## Standards and compliance

- **FHIR R4** — Resources follow the HL7 FHIR R4 specification
- **CARIN Blue Button** — Responses align with the [CARIN Consumer Directed Payer Data Exchange Implementation Guide](http://hl7.org/fhir/us/carin-bb/)
- **OAuth 2.0 + PKCE** — Authorization uses industry-standard OAuth with Proof Key for Code Exchange
- **SMART App Launch** — Compatible with the [SMART App Launch Framework](https://build.fhir.org/ig/HL7/smart-app-launch/)
