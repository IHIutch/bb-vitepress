---
title: Handling Pagination
description: Navigate large result sets from the Blue Button API and build complete datasets.
---

# Handling Pagination

A single patient can have hundreds of claims. Blue Button paginates search results — 10 per page by default, 50 max. Here's how to work through them.

## How pagination works

Search responses include a `link` array with URLs for navigating the result set:

```json
{
  "resourceType": "Bundle",
  "total": 89,
  "link": [
    {
      "relation": "self",
      "url": "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=0&_count=10&patient=..."
    },
    {
      "relation": "first",
      "url": "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=0&_count=10&patient=..."
    },
    {
      "relation": "next",
      "url": "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=10&_count=10&patient=..."
    },
    {
      "relation": "last",
      "url": "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=80&_count=10&patient=..."
    }
  ],
  "entry": [ ... ]
}
```

| Link relation | Description |
|---------------|-------------|
| `self` | The current page |
| `first` | First page of results |
| `next` | Next page (absent on the last page) |
| `previous` | Previous page (absent on the first page) |
| `last` | Last page of results |

## Follow the next link

To get the next page, fetch the URL from the `next` link:

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?startIndex=10&_count=10&patient=..." \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

::: warning
Always use the full URL from `Bundle.link` — don't construct pagination URLs yourself. The server may include parameters you're not aware of.
:::

## Control page size

Use `_count` to control how many resources come back per page:

```bash
# Get 50 claims per page (maximum)
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit?_count=50" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

| Parameter | Default | Maximum |
|-----------|---------|---------|
| `_count` | 10 | 50 |

Larger pages mean fewer requests but bigger responses. If you're pulling all claims for a patient, `_count=50` reduces the number of round trips.

## Build a complete dataset

To fetch all claims for a patient, follow `next` links until there aren't any:

```python
import requests

def fetch_all_claims(base_url, access_token):
    claims = []
    url = f"{base_url}/ExplanationOfBenefit?_count=50"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    while url:
        response = requests.get(url, headers=headers)
        bundle = response.json()

        for entry in bundle.get("entry", []):
            claims.append(entry["resource"])

        # Find the next link, if any
        url = None
        for link in bundle.get("link", []):
            if link["relation"] == "next":
                url = link["url"]
                break

    return claims
```

## Handle data changes during pagination

Claims data can be updated while you're paginating through results. A claim on page 5 might have changed since you fetched page 1.

Strategies for handling this:

- **Accept eventual consistency.** For most apps, small inconsistencies during pagination are fine. The next full sync will catch up.
- **Use `_lastUpdated` to detect changes.** After your initial full fetch, use `_lastUpdated=gtYOUR_LAST_SYNC_DATE` on subsequent requests to get only what changed. See [Going to Production](./going-to-production.md#optimize-your-queries).
- **Compare totals.** If `Bundle.total` changes between pages, data has shifted. You may want to restart.

::: tip
For most apps, the simplest approach is: do a full fetch on first load, then use `_lastUpdated` for incremental updates going forward.
:::
