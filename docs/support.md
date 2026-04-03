---
title: Support
description: Get help with the Blue Button API — community, contact, and common questions.
---

# Support

## Join the community

The [Blue Button API Google Group](https://groups.google.com/g/Developer-group-for-cms-blue-button-api) is the best place to ask questions, share feedback, and connect with other developers building with Blue Button.

## Contact the team

Email [BlueButtonAPI@cms.hhs.gov](mailto:BlueButtonAPI@cms.hhs.gov) for:

- Production access questions
- Technical issues not resolved in documentation
- Privacy policy or terms of service review
- Bug reports

The team typically responds within **3 business days**.

## Common questions

**How do I get started?**
Follow the [Quickstart](./quickstart.md) to make your first API call in 5 minutes.

**How do I get production access?**
See the [Production section](./production/index.md) for requirements, the application process, and what to expect in the demo.

**Why am I getting a 403 on /Patient?**
The user may have denied access to their demographics during authorization. Your app needs to handle this case. See [Scopes](./guides/authentication-and-oauth.md#scopes).

**Why is my refresh token not working?**
Refresh tokens are single-use. Each token exchange gives you a new refresh token. If you used it already, the user needs to re-authorize. See [Common errors](./guides/authentication-and-oauth.md#common-errors).

**How often is data updated?**
Claims data is refreshed weekly from the CCW. New claims typically appear 1-2 weeks after the service date. See [Data freshness](./data-dictionary/index.md#data-freshness).

**Can I test with real data in the sandbox?**
No. The sandbox uses synthetic data only. Real data is only available after you receive production credentials.

## Other CMS APIs

Building with bulk Medicare data? Check out these related CMS APIs:

- [Beneficiary Claims Data API (BCDA)](https://bcda.cms.gov/) — Bulk claims data for ACOs and other organizations
- [Data at the Point of Care (DPC)](https://dpc.cms.gov/) — Claims data for healthcare providers
- [AB2D](https://ab2d.cms.gov/) — Medicare claims data for Part D sponsors
