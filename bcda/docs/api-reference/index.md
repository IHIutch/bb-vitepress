---
title: Endpoints
description: Overview of all BCDA API endpoints for exporting claims data, checking job status, and querying attribution.
---

# Endpoints

All export endpoints use the [FHIR Bulk Data $export operation](https://hl7.org/fhir/R4/operations.html). The `$` before `export` indicates an operation, not a CRUD resource. PowerShell users must escape it with a backtick.

::: info Environment URLs
Use `sandbox.bcda.cms.gov` for sandbox or `api.bcda.cms.gov` for production.
:::

## Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | [/Group/{id}/$export](./group) | Yes | Export data for attributed enrollees (`all` or `runout`) |
| GET | [/Patient/$export](./patient) | Yes | Export data for all currently attributed enrollees |
| GET | [/jobs/{id}](./jobs) | Yes | Check job status or list past jobs |
| DELETE | [/jobs/{id}](./jobs#cancel-a-job) | Yes | Cancel an active job |
| GET | [/attribution_status](./attribution-status) | Yes | Check when attribution data was last updated |
| GET | [/metadata](./metadata) | No | API status and FHIR CapabilityStatement |

## Common request headers

All authenticated requests require:

```yaml
Authorization: Bearer {token}
Accept: application/fhir+json
```

Export requests ($export) also require:

```yaml
Prefer: respond-async
```

## Versioned URLs

<VersionedContent v="v1">

```
/api/v1/Group/all/$export
/api/v1/Patient/$export
```

</VersionedContent>

<VersionedContent v="v2">

```
/api/v2/Group/all/$export
/api/v2/Patient/$export
```

</VersionedContent>

<VersionedContent v="v3">

```
/api/v3/Group/all/$export
/api/v3/Patient/$export
```

</VersionedContent>
