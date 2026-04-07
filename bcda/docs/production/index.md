---
title: Production Access
description: How to authorize your organization, obtain production credentials, and access real Medicare enrollee claims data.
---

# Production Access

[Eligible organizations](/) must obtain credentials from their model-specific system to access real enrollee claims data.

::: warning Before you start
Download test data in the [sandbox](/quickstart) first to verify your integration works.
:::

<ProcessList>
<ProcessStep title="Authorize your model entity">

Production credentials authorize your organization's API access. Create and manage credentials by logging in to your model-specific system:

**ACOs in the Medicare Shared Savings Program:** Only users with the Credential Delegate role can manage credentials from [ACO-MS](https://acoms.cms.gov/api-key-mgmt/bcda).

**REACH ACOs and KCEs/KCF practices in Kidney Care Choices:** Users with any of the following roles can manage credentials from [4innovation (4i)](https://4innovation.cms.gov/secure/api-credentials/bcda):
- Executive Contact
- Entity Primary Contact
- Entity Secondary Contact
- DUA Requestor
- DUA Custodian

Your registered contact can [contact the CMS help desk](https://www.cms.gov/data-research/cms-information-technology/cms-identity-management/help-desk-support) to assign these roles.

</ProcessStep>
<ProcessStep title="Obtain production credentials">

1. Visit the **API Credentials** page in your model-specific system
2. Choose the **BCDA Credentials** tab, then select **Create New API Credentials**
3. Add a public, static IP address for every system (including vendors) that will use the API (up to 8). Allow list updates may take up to an hour.

**Rotate credentials every 90 days.** Visit BCDA Credentials and select the rotate icon in the Actions column.

**Revoke credentials if compromised.** Visit BCDA Credentials and select the delete icon in the Actions column. Email [bcapi@cms.hhs.gov](mailto:bcapi@cms.hhs.gov) to review recent activity.

</ProcessStep>
<ProcessStep title="Access production claims data">

The production environment supports the same workflow, endpoints, and resource types as the sandbox. Follow the same steps from the [Quickstart](/quickstart) using:

- **Base URL:** `api.bcda.cms.gov` (instead of `sandbox.bcda.cms.gov`)
- **Credentials:** Your production client ID and secret

See [Authentication](/guide/authentication) for token details and [Endpoints](/api-reference/) for the full API reference.

</ProcessStep>
</ProcessList>

**Terminated and discontinued organizations** lose access to the API, including runout data, the same day their participation in the model ends.

Need help? Visit [Support](/support) or [join the Google Group](https://groups.google.com/g/bc-api). Do not share [PII/PHI](/support#redacting-pii-and-phi) like tokens, credentials, or claims data.
