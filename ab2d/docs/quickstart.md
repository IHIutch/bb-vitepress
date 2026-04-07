---
description: Walk through the AB2D sandbox environment using test credentials to export, check, and download synthetic claims data.
---

# Try the Sandbox

The sandbox (`sandbox.ab2d.cms.gov`) is a public environment available to anyone who wants to try the API. It contains synthetic (test) claims data.

## Sandbox credentials

Use one of these test credential sets to authenticate. These will **not** work in production.

### Contract Z1001 (10,000 enrollees)

- **Client ID:** `0oa9jyx2w9Z0AntLE297`
- **Client Secret:** `hskbPu-YoWfGDY1gcQq34BfIEyMVuayu87zWDliG`
- **Base64:** `MG9hOWp5eDJ3OVowQW50TEUyOTc6aHNrYlB1LVlvV2ZHRFkxZ2NRcTM0QmZJRXlNVnVheXU4N3pXRGxpRw==`

### Contract Z1002 (10,000 enrollees)

- **Client ID:** `0oa9jz0e1dyNfRMm6297`
- **Client Secret:** `shnG6NGkHcu29ptDsKKRW6q5uFJSSpIpdl_K5fVW`
- **Base64:** `MG9hOWp6MGUxZHlOZlJNbTYyOTc6c2huRzZOR2tIY3UyOXB0RHNLS1JXNnE1dUZKU1NwSXBkbF9LNWZWVw==`

## Step 1: Authenticate

Encode your credentials in Base64 (or use the pre-encoded value from the table above), then exchange them for a bearer token:

```sh
# Encode credentials (or skip this and use the Base64 value directly)
AUTH=$(echo -n "${okta_client_id}:${okta_client_password}" | base64)

# Request a bearer token from the sandbox identity provider
RESP1=$(curl -X POST "https://test.idp.idm.cms.gov/oauth2/aus2r7y3gdaFMKBol297/v1/token?grant_type=client_credentials&scope=clientCreds" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "Authorization: Basic ${AUTH}")

# Extract the token
TOKEN=$(echo $RESP1 | jq -r ".access_token")
```

::: info
Bearer tokens expire after **30 minutes**. If your token expires, repeat these steps for a new one.
:::

## Step 2: Start an export job

Request an export of FHIR ExplanationOfBenefit (EOB) resources:

```sh
RESP2=$(curl -si "https://sandbox.ab2d.cms.gov/api/v2/fhir/Patient/\$export?_type=ExplanationOfBenefit" \
  -H "Accept: application/fhir+json" \
  -H "Prefer: respond-async" \
  -H "Authorization: Bearer ${TOKEN}")
```

You will receive a `202 Accepted` response with a `Content-Location` header containing the job status URL:

```
HTTP/2 202
content-location: https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/2356b9af-9257-41f4-9d82-4e27542ff1be/$status
```

Extract the job ID:

```sh
JOB_ID=$(echo "$RESP2" | grep -i content-location | sed 's%^.*Job/\([^/]*\).*$%\1%')
```

## Step 3: Check job status

Poll the status endpoint until the job completes:

```sh
curl -sw '%{http_code}' -o status.json \
  "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${JOB_ID}/\$status" \
  -H "Accept: application/fhir+json" \
  -H "Authorization: Bearer ${TOKEN}" | {
    read STATUS
    echo "Status: $STATUS"
  }
```

- **`202`** — Job in progress. Wait and retry.
- **`200`** — Job complete. The `status.json` file contains download URLs.

Extract the file name from the response:

```sh
FILE=$(cat status.json | jq -r ".output[0].url" | sed 's%^.*file/\(.*$\)%\1%')
```

## Step 4: Download files

Download the data using the job ID and file name:

```sh
curl "https://sandbox.ab2d.cms.gov/api/v2/fhir/Job/${JOB_ID}/file/${FILE}" \
  -H "Accept: application/fhir+ndjson" \
  -H "Accept-Encoding: gzip" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o "${FILE}.gz"
```

The optional `Accept-Encoding: gzip` header downloads compressed files. Decompress them afterward:

```sh
gunzip "${FILE}.gz"
```

## Verify success

You should now have NDJSON files containing synthetic Medicare claims data. Each line is a JSON object representing a single claim.

To inspect the data, extract and pretty-print the first claim:

```sh
head -1 "${FILE}" | jq
```

::: tip Managing file size
The data for 100 enrollees is over 25 MB. Use [`_since` and `_until` parameters](/api-reference/#query-parameters) when starting a job to reduce the data returned and speed up download times.
:::

## Alternative: Swagger UI

You can also explore the API interactively using the [AB2D Swagger UI](https://sandbox.ab2d.cms.gov/swagger-ui/index.html?urls.primaryName=V2%20-%20FHIR%20R4). Authorize with your bearer token (formatted as `Bearer {your_token}`) and try the endpoints directly.
