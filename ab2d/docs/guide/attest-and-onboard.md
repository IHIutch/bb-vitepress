---
description: How PDP sponsors complete attestation, choose a technical contact, and get production credentials for the AB2D API.
---

# Attest & Onboard

Only active, stand-alone PDP sponsors can access enrollee claims data in production. Follow these 4 steps to get production access.

## 1. Attest to AB2D data protocols

**Completed by:** CEO, CFO, or COO ("Attestor")

A current CEO, CFO, or COO from your organization must agree ("attest") to the Claims Data Usage Protocols. These protocols include [legal limitations on data use and disclosure](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745).

Log in to the [Health Plan Management System (HPMS)](https://hpms.cms.gov/app/ng/cda/attestations) and select *Claims Data Attestation* (under *Contract Management*).

### How to complete attestation

1. Choose single, multiple, or all contracts in the *Contracts Without Attestation* window.
2. Select *Attest*.
3. Agree to the *Claims Data Usage Protocols*.

To add multiple Attestors, follow the same steps and select *Re-attest* during step 2.

### Attestor requirements

- Be part of an active, stand-alone PDP organization (PACE and MAPD are ineligible)
- Hold a current CEO, CFO, or COO role within the organization
- Attest to each contract that will connect to AB2D

### How attestation affects your data

- Claims data is available from the **attestation date onwards**. Data prior to that date is not provided.
- Your organization must have an active Attestor **at all times**. Without one, you cannot receive data. Access is only restored when another active CEO, CFO, or COO attests.
- Once an organization attests, it must complete all remaining steps (below) before data is accessible.

::: warning
It is strongly recommended to have multiple Attestors. If your only Attestor leaves without a replacement, your organization loses API access until a new Attestor completes the process. Re-attestation restores access, including historical data from the gap period.
:::

## 2. Choose an AB2D Data Operations Specialist (ADOS)

**Completed by:** Attestor

After attestation, the Attestor receives an email with instructions on how to assign an ADOS — the primary technical point of contact for your organization.

**ADOS requirements:**
- Employee or vendor authorized to access and view enrollee data
- Technical expertise to connect to and retrieve data from the sandbox and production environments
- Ability to provide static IP address(es) and/or CIDR ranges for every system accessing the API

## 3. Test in the sandbox

**Completed by:** ADOS

The ADOS receives an email with next steps. They must:

1. **Retrieve sandbox data** — Follow the [Try the Sandbox](/quickstart) guide to run a successful export.
2. **Send the job ID** to the AB2D team as confirmation.
3. **Provide IP addresses** — Submit the public, static IP address(es) of every system that will use the API. These will be reviewed, approved, and allowlisted.

You can provide up to 8 IP addresses. They must be static — dynamic IPs are not supported.

## 4. Get production credentials

**Completed by:** Attestor and ADOS

The Attestor receives an email with the organization's production credentials. These credentials allow the ADOS to [authenticate and access production claims data](/production/).

::: danger
Production data contains Personally Identifiable Information (PII) and Protected Health Information (PHI). Handle it in compliance with HIPAA requirements. Do not share credentials or data under any circumstances.
:::

If you have questions, email the AB2D team at [ab2d@cms.hhs.gov](mailto:ab2d@cms.hhs.gov).
