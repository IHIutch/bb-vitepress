---
title: API Reference
description: Full endpoint documentation for the Blue Button API.
---

# API Reference

Complete reference for every Blue Button API endpoint.

## Base URLs

::: code-group
```text [Sandbox]
https://sandbox.bluebutton.cms.gov/v2/fhir/
```
```text [Production]
https://api.bluebutton.cms.gov/v2/fhir/
```
:::

## Authentication

All requests require a Bearer token in the `Authorization` header. See [Authentication & OAuth](../guide/authentication-and-oauth.md).

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | [`/Patient`](./patient.md) | Patient demographics |
| GET | [`/Patient/{id}`](./patient.md) | Single patient by ID |
| GET | [`/Coverage`](./coverage.md) | Insurance coverage |
| GET | [`/Coverage?beneficiary={id}`](./coverage.md) | Coverage for a specific patient |
| GET | [`/ExplanationOfBenefit`](./explanation-of-benefit.md) | All claims for the authorized patient |
| GET | [`/ExplanationOfBenefit?patient={id}`](./explanation-of-benefit.md) | Claims for a specific patient |
| GET | [`/ExplanationOfBenefit/{id}`](./explanation-of-benefit.md) | Single claim by ID |
| GET | [`/connect/userinfo`](./userinfo.md) | Authenticated user info |
| GET | `/metadata` | FHIR capability statement |

## Common parameters

These parameters work across FHIR search endpoints:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `_count` | Results per page (default 10, max 50) | `?_count=50` |
| `_lastUpdated` | Filter by last update date | `?_lastUpdated=gt2026-01-01` |
| `startIndex` | Offset for pagination | `?startIndex=10` |

## Response format

Search endpoints return FHIR Bundles. Read endpoints (with an ID) return a single resource. See [Fetching Patient Data](../guide/fetching-patient-data.md) for details on reading responses.

## Swagger

For interactive API exploration, see the [Swagger documentation](https://sandbox.bluebutton.cms.gov/docs/openapi).
