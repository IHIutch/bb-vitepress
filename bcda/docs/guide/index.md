---
title: Developer Docs
description: Technical documentation for the Beneficiary Claims Data API, including quickstart, endpoints, data model, and filtering.
---

# Developer Docs

BCDA uses [Bulk FHIR](https://hl7.org/fhir/uv/bulkdata/) to export Medicare claims data. You authenticate with client credentials, start an export job, poll for completion, then download NDJSON files.

## Start here

**New to BCDA?** The [Quickstart](/quickstart) gets you from zero to downloaded data in 5 steps using the sandbox.

**Need production access?** Follow the steps on [Production Access](/production/).

## Reference

- [Authentication](./authentication) — Bearer tokens, credentials, expiration
- [Endpoints](/api-reference/) — /Group, /Patient, /jobs, /attribution_status, /metadata
- [Data Model](/data-dictionary/) — Resource types and what they contain
- [Filtering](./filtering) — _type, _since, _typeFilter parameters
- [Errors & Troubleshooting](./errors) — Response codes and common issues

## Migrating between versions

- [v1 to v2](./migration/v1-to-v2) — FHIR STU3 to R4
- [v2 to v3](./migration/v2-to-v3) — Unified data source, new filtering

## Additional resources

- [FHIR/HL7 specification](https://www.hl7.org/fhir/)
- [Bulk FHIR specification](https://build.fhir.org/ig/HL7/VhDir/bulk-data.html)
- [CARIN Blue Button Implementation Guide](https://www.hl7.org/fhir/us/carin-bb/)
- [JSON format](https://www.json.org/json-en.html) and [NDJSON specification](https://github.com/ndjson/ndjson-spec/)
- [FHIR data validation](https://hl7.org/fhir/R4/validation.html)
