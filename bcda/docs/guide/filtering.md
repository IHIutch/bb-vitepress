---
title: Filtering
description: Use _type, _since, _typeFilter, and runout parameters to filter BCDA claims data exports.
---

# Filtering

Use parameters to filter or narrow the data returned by export jobs. This reduces download times and file sizes.

## The _type parameter

Limit your export to specific resource types. Without `_type`, all available resource types are returned.

**Single resource type:**

```
GET /api/v2/Group/all/$export?_type=Patient
```

**Multiple resource types** (comma-separated):

```
GET /api/v2/Group/all/$export?_type=ExplanationOfBenefit,Patient
```

**Partially adjudicated claims** (ACO REACH only):

```
GET /api/v2/Group/all/$export?_type=Claim,ClaimResponse
```

**Example curl command:**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export?_type=ExplanationOfBenefit,Patient" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

## The _since parameter

Filter for resources last updated after a specified date. Dates must be in [FHIR instant format](https://www.hl7.org/fhir/datatypes.html#instant): `YYYY-MM-DDThh:mm:ss.sss+zz:zz`

**Example:** February 20, 2020 12:00 PM EST → `2020-02-20T12:00:00.000-05:00`

::: warning Data before 02/12/2020
Due to data source limitations, claims before 02/12/2020 have an arbitrary `lastUpdated` date of 01/01/2020. Specifying a `_since` date between 01/01/2020 and 02/11/2020 returns all historical data. Dates from 02/12/2020 onward are accurate.
:::

We recommend new organizations run an unfiltered request for all historical data first, then use `_since` for subsequent incremental exports. Use the `transactionTime` from your most recent job as the date value.

### _since with /Patient

Returns resources updated after the specified date for both existing and newly attributed enrollees. Without `_since`, returns data as far back as 2014.

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Patient/\$export?_type=Patient&_since=2020-02-13T08:00:00.000-05:00" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

### _since with /Group

Returns resources updated after the specified date for **existing enrollees** and **all resources** for **newly attributed enrollees**. This lets you get full history for new enrollees and only updates for existing ones in a single request.

Without `_since`, returns data as far back as 2014.

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/all/\$export?_type=Patient&_since=2020-02-13T08:00:00.000-05:00" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```

## The _typeFilter parameter <Badge type="warning" text="v3 only" />

<VersionedContent v="v3">

The `_typeFilter` parameter filters export jobs based on resource metadata. Currently it supports filtering ExplanationOfBenefit resources by `meta.tag`.

### Filter by adjudication status

Use `_typeFilter` to request only fully adjudicated or only partially adjudicated claims:

**Fully adjudicated claims only:**

```
GET /api/v3/Group/all/$export?_type=ExplanationOfBenefit&_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/Final-Action|FinalAction
```

**Partially adjudicated claims only:**

```
GET /api/v3/Group/all/$export?_type=ExplanationOfBenefit&_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/Final-Action|NotFinalAction
```

### Filter by system type

```
GET /api/v3/Group/all/$export?_type=ExplanationOfBenefit&_typeFilter=ExplanationOfBenefit?_tag=https://bluebutton.cms.gov/fhir/CodeSystem/System-Type|SharedSystem
```

Omitting `_typeFilter` returns both partially and fully adjudicated claims.

</VersionedContent>

## The runout identifier

Request data for enrollees attributed to your organization during the previous year but not the current year. Claims data returned will have service dates no later than December 31 of the previous year.

Use `/Group/runout` instead of `/Group/all`:

```
GET /api/v2/Group/runout/$export
```

**With _type:**

```
GET /api/v2/Group/runout/$export?_type=Patient
```

**Example curl command:**

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/Group/runout/\$export?_type=ExplanationOfBenefit,Patient" \
    -H "Accept: application/fhir+json" \
    -H "Prefer: respond-async" \
    -H "Authorization: Bearer {token}" \
    -i
```
