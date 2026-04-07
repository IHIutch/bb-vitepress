---
description: Access real Medicare enrollee claims data in the AB2D production environment using your production credentials.
---

# Go to Production

The production environment provides access to real Medicare enrollee claims data. You must have completed the [Attest & Onboard](/guide/attest-and-onboard) steps before proceeding.

::: danger
Production data contains Protected Health Information (PHI). Run all scripts in a secure environment and handle data in compliance with HIPAA requirements.
:::

## What changes from sandbox

| | Sandbox | Production |
|---|---|---|
| **API URL** | `sandbox.ab2d.cms.gov` | `api.ab2d.cms.gov` |
| **Identity Provider** | `test.idp.idm.cms.gov/oauth2/aus2r7y3gdaFMKBol297/v1/token` | `idm.cms.gov/oauth2/aus2ytanytjdaF9cr297/v1/token` |
| **Credentials** | Public test credentials | Issued by AB2D team |
| **Data** | Synthetic | Real enrollee claims (PHI) |

The endpoints and workflow are identical — you just swap the URLs and credentials.

## Create a credential file

Store your Base64-encoded credentials in a file for use with scripts.

::: code-group
```sh [Linux/Mac]
AUTH_FILE=/home/abcduser/credentials_Z123456_base64.txt
OKTA_CLIENT_ID=your_client_id
OKTA_CLIENT_PASSWORD=your_password
echo -n "$OKTA_CLIENT_ID:$OKTA_CLIENT_PASSWORD" | base64 > $AUTH_FILE
```
```powershell [PowerShell]
$AUTH_FILE = "C:\users\abcduser\credentials_Z123456_base64.txt"
New-Item -Path $AUTH_FILE -ItemType File
$BASE64_ENCODED_ID_PASSWORD = '{base64_encoded_credentials}'
Set-Content -Path $AUTH_FILE $BASE64_ENCODED_ID_PASSWORD
```
:::

## Authenticate

```sh
AUTH=$(cat /home/abcduser/credentials_Z123456_base64.txt)

RESP1=$(curl -X POST "https://idm.cms.gov/oauth2/aus2ytanytjdaF9cr297/v1/token?grant_type=client_credentials&scope=clientCreds" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -H "Authorization: Basic ${AUTH}")

TOKEN=$(echo $RESP1 | jq -r ".access_token")
```

## Run the export

The same 3-step flow as the sandbox, with production URLs:

```sh
# Start a job
RESP2=$(curl -si "https://api.ab2d.cms.gov/api/v2/fhir/Patient/\$export" \
  -H "Accept: application/fhir+json" \
  -H "Prefer: respond-async" \
  -H "Authorization: Bearer ${TOKEN}")

JOB_ID=$(echo "$RESP2" | grep -i content-location | sed 's%^.*Job/\([^/]*\).*$%\1%')

# Check status (repeat until 200)
curl -sw '%{http_code}' -o status.json \
  "https://api.ab2d.cms.gov/api/v2/fhir/Job/${JOB_ID}/\$status" \
  -H "Accept: application/fhir+json" \
  -H "Authorization: Bearer ${TOKEN}"

# Download files
FILE=$(cat status.json | jq -r ".output[0].url" | sed 's%^.*file/\(.*$\)%\1%')
curl "https://api.ab2d.cms.gov/api/v2/fhir/Job/${JOB_ID}/file/${FILE}" \
  -H "Accept: application/fhir+ndjson" \
  -H "Accept-Encoding: gzip" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o "${FILE}.gz"
```

::: warning
Jobs expire after **72 hours** or **6 downloads**, whichever comes first. Requests that take longer than **30 hours** will time out. Use [query parameters](/api-reference/#query-parameters) to reduce the data returned.
:::

## Sample client scripts

AB2D provides sample scripts to automate the export workflow. These are for getting started — they do not provide sufficient error checking, security, or auditing for long-term use.

If you have multiple contracts, run scripts in separate directories with separate credentials and terminals.

### Bash

Download the [Bash sample client](https://github.com/CMSgov/ab2d-sample-client-bash) and run:

```sh
# Set up environment
source bootstrap.sh -prod \
  --directory /home/abcduser/ab2d \
  --auth /home/abcduser/credentials_Z123456_base64.txt \
  --since 2020-05-01T00:00:00.000-05:00 \
  --fhir R4 \
  --gzip

# Start the export
./start-job.sh

# Monitor until complete (auto-polls)
./monitor-job.sh

# Download results
./download-results.sh
```

### PowerShell

Download the [PowerShell sample client](https://github.com/CMSgov/ab2d-sample-client-powershell) and run:

```powershell
# Set environment variables
$AUTH_FILE = "C:\users\abcduser\credentials_Z123456_base64.txt"
$AUTHENTICATION_URL = 'https://idm.cms.gov/oauth2/aus2ytanytjdaF9cr297/v1/token'
$AB2D_API_URL = 'https://api.ab2d.cms.gov/api/v2'

# Start and monitor the job
$JOB_RESULTS = & .\create-and-monitor-export-job.ps1 | Select-Object -Last 1

# Download files
.\download-results.ps1
```

### Python

Download the [Python sample client](https://github.com/CMSgov/ab2d-sample-client-python). Requires Python 3.6+.

::: code-group
```sh [Linux/Mac]
AUTH_FILE=/home/abcduser/credentials_Z123456_base64.txt
DIRECTORY=/home/abcduser/ab2d

# Start the export
python job-cli.py -prod --auth $AUTH_FILE --directory $DIRECTORY \
  --since '2020-05-01T00:00:00.000-05:00' --fhir R4 --only_start

# Monitor until complete
python job-cli.py -prod --auth $AUTH_FILE --directory $DIRECTORY --only_monitor

# Download files
python job-cli.py -prod --auth $AUTH_FILE --directory $DIRECTORY --only_download
```
```powershell [Windows]
$AUTH_FILE = "C:\users\abcduser\credentials_Z123456_base64.txt"
$DIRECTORY = "C:\users\abcduser\ab2d"

# Start the export
python job-cli.py -prod --auth %AUTH_FILE% --directory %DIRECTORY% `
  --since '2020-05-01T00:00:00.000-05:00' --fhir R4 --only_start

# Monitor until complete
python job-cli.py -prod --auth %AUTH_FILE% --directory %DIRECTORY% --only_monitor

# Download files
python job-cli.py -prod --auth %AUTH_FILE% --directory %DIRECTORY% --only_download
```
:::

## Incremental exports

AB2D automatically tracks your last successful export. By default, each new job only returns data updated since then. This reduces duplication and speeds up job times. We recommend running exports **bi-weekly**.

You can also use `_since` and `_until` parameters to target specific date ranges. See [API Reference — Incremental Export Model](/api-reference/#incremental-export-model) for details.

## Clean up

After downloading files, clean up your directory. Move NDJSON files to a permanent location and remove script-generated files (`jobId.txt`, `response.json`). Re-running scripts may overwrite old files.
