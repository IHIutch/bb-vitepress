---
title: /attribution_status Endpoint
description: Check when your organization's enrollee attribution data was last updated.
---

# /attribution_status

Check when your organization's attribution and runout files were last updated. Attribution files update once per month. Use this to determine if you have new enrollees whose full claims history you should retrieve.

## Request

```
GET /api/v2/attribution_status
```

### Headers

```yaml
Authorization: Bearer {token}
Accept: application/json
```

### Example

```shell
curl -X GET "https://sandbox.bcda.cms.gov/api/v2/attribution_status" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer {token}"
```

## Response

### 200 — success

```json
{
  "ingestion_dates": [
    {
      "type": "last_attribution_update",
      "timestamp": "2020-12-22 22:31:40.397916+00"
    },
    {
      "type": "last_runout_update",
      "timestamp": "2020-12-22 22:31:40.397916+00"
    }
  ]
}
```

### 404 — no data

Returned if BCDA has never ingested an attribution or runout file for your organization.

## Usage

Compare the `last_attribution_update` timestamp to the date of your most recent export job. If attribution was updated more recently, you may have newly attributed enrollees whose claims data you should download. Use `/Group/all` with the [_since parameter](/guide/filtering#_since-with-group) to get full history for new enrollees and only updates for existing ones.
