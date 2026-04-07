---
title: Application Review
description: What to expect when applying for Blue Button production access — the process, the demo, and what comes after.
---

# Application Review

You've built your app, written your privacy policy, and tested in the sandbox. Here's how the production access review works.

## 1. Submit your application

Email [BlueButtonAPI@cms.hhs.gov](mailto:BlueButtonAPI@cms.hhs.gov) to request production access. The team typically responds within 24 business hours with a link to the production access form.

The form asks for:

- Organization name
- Application name
- Your use case for Medicare enrollees
- Application redirect URI
- Point of contact
- PDF of your privacy policy
- PDF of your terms of service

## 2. Schedule your demo

After you submit the form, the Blue Button team will schedule a **1-hour demo over Zoom**.

### What to prepare

The demo is your chance to walk through your app. Be ready to show:

- **Account creation** — How a new user signs up
- **Authorization flow** — The full Medicare data connection experience, including your consent flow
- **Data display** — How your app presents enrollee data
- **Data usage** — How the data is used within your app
- **Data sharing** — If applicable, how enrollees share data with others (providers, caregivers)
- **Disconnect/revoke** — How users stop sharing their data

Also be ready to discuss:

- Your privacy policy and terms of service
- Security practices
- How you handle edge cases (denied demographics, revoked access, expired tokens)

### Common things the team looks for

- Clear consent flow before the Medicare.gov redirect
- No pre-checked consent boxes
- Easy-to-find disconnect option
- Privacy policy is accessible and readable
- App handles 403s gracefully when demographics are denied
- Data usage matches what's described in the application

## 3. Address any feedback

After the demo, the team reviews your app, privacy policy, and terms of service. They may:

- **Approve** — You're ready for production credentials
- **Request changes** — Specific items to address before approval (e.g., privacy policy gaps, UI issues)
- **Request another demo** — In some cases, a follow-up demo is needed

Turnaround time varies, but the team will communicate clearly about what's needed.

## 4. Receive production credentials

Once approved, you'll receive a link to the post-approval form. This form includes:

- How you want your app listed in the [Medicare connected apps directory](https://www.medicare.gov/providers-services/claims-appeals-complaints/claims/share-your-medicare-claims/connected-apps)
- Additional configuration details

After you submit the post-approval form, the team schedules the handoff of production API credentials.

::: tip
Production credentials are different from sandbox credentials. Update your app's configuration before going live.
:::

## Timeline

| Step | Typical duration |
|------|-----------------|
| Initial response to email | ~24 business hours |
| Form review + demo scheduling | 1-2 weeks |
| Demo | 1 hour |
| Post-demo review | 1-2 weeks |
| Credential handoff | Scheduled after approval |

These are typical timelines — your experience may vary depending on the complexity of your app and whether changes are needed.

## Questions?

Email [BlueButtonAPI@cms.hhs.gov](mailto:BlueButtonAPI@cms.hhs.gov) or ask in the [Blue Button API Google Group](https://groups.google.com/g/Developer-group-for-cms-blue-button-api). The team typically responds within 3 business days.
