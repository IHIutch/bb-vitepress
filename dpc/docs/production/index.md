# Go to Production

This chapter covers what changes when you move from the sandbox to production, what you need to apply, and your ongoing obligations.

## What changes from sandbox

| | Sandbox | Production |
|---|---|---|
| **Base URL** | `https://sandbox.dpc.cms.gov` | `https://dpc.cms.gov` |
| **Data** | Synthetic (fake) beneficiaries | Real Medicare FFS claims |
| **Sign-up** | Self-service | Application reviewed by CMS |
| **IP registration** | Not required | Required (up to 8 IPv4 addresses) |
| **Security certification** | Not required | Required |
| **Unique tokens per org** | Yes | Yes |

Your code stays the same — change the base URL and use real credentials. All endpoints, headers, and response formats are identical.

## Production application process

::: warning
<!-- TODO: This section needs input from the DPC program team. The production application process is not documented in the current site. -->
Details about the production application process will be added here. Contact the [DPC Google Group](https://groups.google.com/d/forum/dpc-api) for current guidance on applying for production access.
:::

## Security requirements

To access production data, your software and IT systems must meet **at least one** of the following certifications:

- **ONC Health IT Certification** — Office of the National Coordinator for Health Information Technology
- **HITRUST CSF Validated Assessment** (or self-validation, valid one year if pursuing validated assessment)
- **EHNAC Accreditation** — any of the following programs:
  - ACOAP, DRAP, DT P&S, EHNAC P&S, FSAP-EHN, FSAP-Lockbox, HIEAP, HNAP-Medical Biller, HNAP-TPA, MSOAP, OSAP, PMSAP, TDRAAP Comprehensive, TNAP (Participant/Member or QHIN)
- **SOC 2** — Type 2 certified (or Type 1, valid one year if pursuing Type 2)
- **ISO** — 27001, 27017, or 27018 certified

You attest to meeting these requirements at registration and with each API request.

## Ongoing obligations

### Attribution notice

All applications that use DPC must display this notice prominently:

> "This product uses the Data at the Point of Care API but is not endorsed or certified by the Centers for Medicare & Medicaid Services or the U.S. Department of Health and Human Services."

You may use CMS's name or logo to identify the source of API content, but not to imply endorsement. See [CMS Branding Guidelines](https://www.cms.gov/About-CMS/Agency-Information/CMS-Brand-Identity).

### 90-day re-attestation

Attribution groups expire after **90 days**. You must re-attribute patients to practitioners' groups to maintain data access. Patients with expired attributions are excluded from bulk exports. See [Refresh expired attributions](/guide/build-integration#refresh-expired-attributions).

### HIPAA compliance

- Data can only be requested by a covered entity (or business associate on behalf of a covered entity) for treatment purposes under 45 C.F.R. § 164.506
- You must comply with all applicable federal and state privacy and security laws
- Business associates must not use DPC except as an authorized agent of the covered entity
- You must be able to associate each API request with the specific covered entity making the request

For full legal details, see the [Terms of Service](/production/terms-of-service).

### IP address management

Register up to 8 IPv4 addresses in the [DPC Portal](https://dpc.cms.gov). IP ranges are not supported. Update your registered addresses when your infrastructure changes.

## Current status of production access

See the [Current Status section on the About page](/about/#current-status) for the latest information on production onboarding.
