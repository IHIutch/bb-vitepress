---
title: Requirements
description: Detailed requirements for Blue Button production access — privacy policy, terms of service, and technical readiness.
---

# Production Requirements

The Blue Button team reviews your app, privacy policy, and terms of service before issuing production credentials. Here's exactly what you need.

## 1. Complete sandbox testing

Your app must be substantially complete and tested against the sandbox before applying. This means:

- [ ] OAuth 2.0 with PKCE working end-to-end
- [ ] Tested with multiple synthetic users (not just one)
- [ ] Handles all claim types your app uses
- [ ] Pagination working for large datasets
- [ ] Token refresh and expiration handled
- [ ] Graceful handling when user denies demographic access

See the [testing checklist](../guide/going-to-production.md#testing-checklist) for details.

## 2. Write a privacy policy

Your privacy policy must clearly explain to Medicare enrollees how their data is used. It should be:

- **Prominent and publicly accessible** — Easy to find on your site
- **Easy to read** — Written for a general audience, not lawyers. Consider using readability checking software.
- **Based on industry best practices**

Your privacy policy must address:

### Data collection and sharing

- Whether and how data is shared with third parties
- What data is shared, and with whom
- Whether sharing is one-time or ongoing
- If ongoing, for how long

### De-identified data

- Any use of de-identified, anonymized, or pseudonymized data
- Risks of re-identification, if applicable

### Data lifecycle

- What happens to data if a user revokes access — do you delete it or retain it?
- Your policy on dormant or closed accounts
- Data retention periods

### Notifications

- How you notify users of privacy policy changes (with the ability to update settings or opt out)
- How you notify users of a security breach, per the FTC's [Health Breach Notification Rule](https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule)
- How users are notified if your company is sold

### Third-party vendors

- Whether your vendors commit to data protection requirements consistent with applicable law

::: tip
Consider also creating a **privacy notice** — a plain-language summary of your privacy policy. The ONC's [Model Privacy Notice template](https://www.healthit.gov/topic/privacy-security-and-hipaa/model-privacy-notice-mpn) is a good starting point.
:::

## 3. Write terms of service

Your terms of service may not contradict, negate, or detract from the protections in your privacy policy.

Both documents must be publicly available and presented in your app so users can actively opt in — no pre-checked boxes or default consent.

::: warning
Any changes to your privacy policy or terms of service after production approval must be submitted to [BlueButtonAPI@cms.hhs.gov](mailto:BlueButtonAPI@cms.hhs.gov) for review before rolling out. The Blue Button team reviews within 5 business days.
:::

## 4. Read the Blue Button Terms of Service

Read and understand the [Blue Button API Terms of Service](./terms-of-service.md). Your application for production access includes an attestation that your privacy policy covers all requirements listed in the Blue Button ToS.

## 5. Meet security requirements

- Comply with all applicable laws and industry best practices for protecting PII and PHI
- If applicable, ensure HIPAA compliance
- Minimize risk of unauthorized access, use, or disclosure

## 6. Follow the Blue Button naming guidelines

If your app connects to multiple data sources and users pick from a list, use **"Medicare"** as the Blue Button data source name. Don't use "Blue Button," "CMS Blue Button," "Medicare.gov," or other variations.

## Next step

Once you've met all requirements, [apply for production access and schedule your demo](./application-review.md).
