---
title: Support
description: Contact the BCDA team, join the Google Group, and learn how to redact PII and PHI when sharing information.
---

# Support

## Contact us

Join the [BCDA Google Group](https://groups.google.com/g/bc-api) or email [bcapi@cms.hhs.gov](mailto:bcapi@cms.hhs.gov) to ask questions and get help.

When troubleshooting API requests, include:

- Whether this is a **sandbox** or **production** request
- Your organization's **5-character entity ID** (or sandbox dataset)
- The **API request** that's causing the problem
- Any **response messages** from the API

## Redacting PII and PHI

Cover or label [Personally Identifiable Information (PII)](https://www.hhs.gov/answers/hhs-administrative/what-is-pii/index.html) and [Protected Health Information (PHI)](https://www.hhs.gov/answers/hipaa/what-is-phi/index.html) as **"REDACTED"** in all Google Group posts and email communication. Ensure any masks in screenshots are 100% opaque.

**Examples of PII/PHI to redact:**

- Medicare Beneficiary Identifier (MBI)
- Taxpayer Identification Number (TIN)
- National Provider Identifier (NPI)
- Social Security Number (SSN)
- API keys, client IDs, client secrets
- Authorization or bearer tokens

**These can appear in:**

- Text of Google Group posts or emails
- Attached files (XML, JSON)
- Screenshots

**Example of a redacted response:**

```json
{
    "taxpayerIdentificationNumber": "REDACTED",
    "nationalProviderIdentifier": "REDACTED"
}
```

## Feature requests

Have feedback on data elements or features you'd like to see? Post in the [Google Group](https://groups.google.com/g/bc-api) or email [bcapi@cms.hhs.gov](mailto:bcapi@cms.hhs.gov).
