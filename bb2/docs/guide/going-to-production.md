---
title: Going to Production
description: Optimize your app, pass compliance checks, and prepare for the production access review.
---

# Going to Production

Before you apply for production access, make sure your app is performant, compliant, and thoroughly tested. This guide covers everything you need to do before submitting your application.

## Before you apply

Quick checklist of technical readiness:

- [ ] Tested against multiple synthetic users (not just one)
- [ ] Handling pagination for large EOB bundles
- [ ] Handling token refresh and expiration
- [ ] Handling cases where the user denies demographic access
- [ ] Using gzip compression
- [ ] Filtering by claim type where possible
- [ ] Consent flow meets CMS requirements
- [ ] Privacy policy and terms of service finalized

## Optimize your queries

### Enable gzip compression

Add `Accept-Encoding: gzip` to your requests. This significantly reduces response sizes, especially for EOB bundles:

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?_count=50" \
  -H "Accept: application/json" \
  -H "Accept-Encoding: gzip" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Gzip works for `application/json`, `application/fhir+json`, `text/html`, and `text/plain`. Minimum payload size is 1 KB. Check for `Content-Encoding: gzip` in the response before decompressing.

### Filter by claim type

If you only need specific claim types, use the `type` parameter instead of fetching everything:

```bash
# Only pharmacy claims
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?type=pde" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Multiple types (comma-separated)
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?type=carrier,inpatient,outpatient" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Available types:

| Type | Description |
|------|-------------|
| `carrier` | Physician/supplier claims |
| `dme` | Durable Medical Equipment |
| `hha` | Home Health Agency |
| `hospice` | Hospice |
| `inpatient` | Hospital inpatient |
| `outpatient` | Hospital outpatient |
| `snf` | Skilled Nursing Facility |
| `pde` | Prescription Drug Events |

::: warning
Type values are case-sensitive. Invalid types return a `400 Bad Request`.
:::

### Use `_lastUpdated` for incremental sync

After your initial full data load, use `_lastUpdated` to fetch only what's changed:

```bash
# Get claims updated after a specific date
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?_lastUpdated=gt2026-03-01T08:00:00-05:00" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Supported operators: `gt` (greater than), `lt` (less than), `ge` (greater than or equal), `le` (less than or equal).

You can specify a range with two `_lastUpdated` parameters:

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?\
_lastUpdated=gt2026-03-01T08:00:00-05:00&\
_lastUpdated=lt2026-03-15T08:00:00-05:00" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

::: warning
Don't use dates before 2020-02-12 with `_lastUpdated`.
:::

## Handle rate limiting

Blue Button rate-limits API requests. If you hit the limit, you'll get a `429 Too Many Requests` response. Handle it with exponential backoff:

1. Wait and retry after the duration specified in the `Retry-After` header
2. If no `Retry-After` header, wait 1 second, then double on each subsequent `429`
3. Cap your backoff at a reasonable maximum (e.g., 60 seconds)

## CARIN IG compliance

The Blue Button API aligns with the [CARIN Consumer Directed Payer Data Exchange Implementation Guide](http://hl7.org/fhir/us/carin-bb/). If your app works with other payer APIs, following the CARIN IG ensures interoperability.

Key things to know:

- CARIN uses `supportingInfo` instead of extensions for many data points
- Blue Button provides data in both formats for backwards compatibility
- CARIN defines standard code systems for adjudication, claim types, and supporting info categories

If you're building for Blue Button only, you don't need to study the full IG — but awareness of it helps if you plan to integrate with other FHIR APIs.

Reference:
- [CARIN IG](http://hl7.org/fhir/us/carin-bb/)
- [HL7 FHIR CPCDS IG](http://hl7.org/fhir/us/carin-bb/STU2/)

## Testing checklist

Before your production demo, test these scenarios:

<!-- TODO: Asset missing — synthetic_users_by_claim_count_full.csv
- [ ] **Multiple users** — Test with several synthetic users (use the [synthetic users CSV](/assets/files/synthetic_users_by_claim_count_full.csv) to find users with different claim volumes)
-->
- [ ] **Large datasets** — Some synthetic users have hundreds of claims. Verify your pagination handles them
- [ ] **Missing demographics** — Simulate a user who denies `patient/Patient.rs` scope access
- [ ] **Token expiration** — Use the [sandbox `/expire_authenticated_user` endpoint](./authentication-and-oauth.md#testing-token-expiration) to test expired tokens
- [ ] **Revoked access** — Test what happens when a user disconnects your app
- [ ] **All claim types** — Verify your app handles carrier, inpatient, outpatient, PDE, DME, HHA, hospice, and SNF claims
- [ ] **Error handling** — Test `401`, `403`, `404`, and `429` responses

## Next step

Ready to apply? Head to the [Production section](../production/index.md) for the application process, requirements checklist, and what to expect in the demo.
