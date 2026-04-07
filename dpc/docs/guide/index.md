---
title: Developer Guide
description: Technical documentation for the Data at the Point of Care API, including setup, integration, and API reference.
---

# Developer Guide

DPC uses [Bulk FHIR](https://hl7.org/fhir/uv/bulkdata/) to export Medicare claims data. You authenticate with a signed JWT, manage practitioner rosters, and export NDJSON files for your attributed patients.

## Start here

**New to DPC?** The [Quickstart](/quickstart) walks you through your first API request using the sandbox.

**Ready to build?** Follow these chapters in order:

1. [Set Up Your Environment](./setup) — Create an account, generate keys, and get an access token
2. [Build Your Integration](./build-integration) — Manage practitioners, patients, groups, and exports

## Reference

- [API Reference](/api-reference/) — Quick-lookup for all endpoints
- [Data Dictionary](/data-dictionary/) — FHIR resource types and what they contain

## Going live

- [Production](/production/) — Requirements, application process, and ongoing obligations
