---
title: Changelog
description: Recent changes to the Blue Button API — new features, fixes, and deprecations.
---

# Changelog

Recent changes to the Blue Button API. Subscribe to the [Blue Button API Google Group](https://groups.google.com/g/Developer-group-for-cms-blue-button-api) for announcements.

<!-- 
  NOTE: This page needs real release data from the Blue Button team.
  The entries below are examples showing the intended format.
  Replace with actual changelog entries.
-->

---

## 2026-01-15

- Added `_lastUpdated` support for Coverage resource searches
- Fixed incorrect adjudication codes on DME claims for certain provider types
- Updated synthetic data: `BBUser00000`–`BBUser09999` refreshed with rolling claims

## 2025-11-01

- Terms of Service v3 remains current — no changes
- Improved error messages for invalid `type` parameter values on ExplanationOfBenefit searches

## 2025-09-01

- CARIN IG STU2 alignment: `supportingInfo` fields now populated alongside extensions
- New synthetic user `BBUser10000` with expanded field coverage for testing

---

::: tip
Use the [`_lastUpdated` parameter](./guide/going-to-production.md#use-_lastupdated-for-incremental-sync) to detect data changes in your application without polling for full datasets.
:::
