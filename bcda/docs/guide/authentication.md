---
title: Authentication
description: How to authenticate with BCDA using bearer tokens, manage credentials, and resolve common auth issues.
---

# Authentication

BCDA uses OAuth 2.0 client credentials. You exchange a client ID and secret for a bearer token, then include that token in all API requests.

## Environments

| | Sandbox | Production |
|---|---|---|
| **Base URL** | `sandbox.bcda.cms.gov` | `api.bcda.cms.gov` |
| **Token endpoint** | `https://sandbox.bcda.cms.gov/auth/token` | `https://api.bcda.cms.gov/auth/token` |
| **Credentials** | [Sandbox credentials](#sandbox-credentials) below | Issued via [Production Access](/production/) |
| **Data** | Synthetic test data | Real Medicare enrollee data |

## Bearer tokens

### Requesting a token

POST to the token endpoint with your credentials using Basic Auth. Credentials are formatted as `client_id:client_secret`, Base64-encoded:

```shell
curl -d "" -X POST "https://sandbox.bcda.cms.gov/auth/token" \
    --user {client_id}:{client_secret} \
    -H "Accept: application/json"
```

Successful response:

```json
{
  "access_token": "eyJhbGciOiJSUzUxMiIsInR...",
  "expires_in": "1200",
  "token_type": "bearer"
}
```

### Using a token

Include the token in the `Authorization` header of every request. `Bearer` must be capitalized and followed by a space:

```yaml
Authorization: Bearer {access_token}
```

### Token expiration

- Bearer tokens expire **20 minutes** after generation
- In-progress and queued jobs are **not interrupted** when your token expires
- If a job completes after your token expires, generate a new token to download the files (files remain available for 24 hours)

## Credential management

### Production credentials

Production credentials are issued through your model-specific system during [Production Access](/production/). They must be **rotated every 90 days**.

### IP allow list

All production requests must come from a registered IP address. You can register up to 8 IP addresses (including vendor systems) through your model-specific system. Allow list changes may take up to an hour to propagate.

::: warning Connection timeouts
If you receive connection timeout errors with production credentials, verify that the IP address making the request is on your allow list. Visit [Production Access](/production/) for details.
:::

## Sandbox credentials

Sandbox credentials allow anyone to access synthetic test data. These credentials do not work in production.

### Adjudicated claims — simple datasets

For testing data retrieval and ingestion. Data may not reflect accurate disease or demographic distributions.

### Adjudicated claims — advanced datasets

Realistic distribution of disease and demographic information. Better for in-depth exploration or load testing.

### Partially adjudicated claims datasets

Anyone can access partially adjudicated claims in the sandbox. In production, only ACO REACH participants have access.

### All sandbox credentials

| Dataset | Client ID | Client Secret |
|---|---|---|
| Simple — Extra-small (50 enrollees) | `2462c96b-6427-4efb-aed7-118e20c2e997` | `e5bf53ec3a4304ab43c00155cfe1f01a00a6f6003ad07d323b3b6bce9ad4ae5b137ef4e8509d881b` |
| Simple — Extra-large (30,000 enrollees) | `aa2d6b93-bbe7-4d1b-8cc5-9a5172fae3a6` | `97755772b3fb7b3fa2f58c5c3aaaffbc7e346639ff8da371a81adf79889c8fbd4c40398cd39d211d` |
| Advanced — Extra-small (100 enrollees) | `e75679c2-1b58-4cf5-8664-d3706de8caf5` | `67570807508212a220cc364d4406b9bd560276142d46257f76ba28dd9a0ff969e0c26db21c9d925c` |
| Advanced — Large (10,000 enrollees) | `0a0c75f0-da95-4198-9c0f-666b41e21017` | `c637024fa21adda5a756a2753cf7eb9bd62292e7897fb965a5c7aeeed23e1728ddc9ec6863f09f15` |
| Partially adjudicated — Extra-small REACH ACO (110 enrollees) | `7e57394f-eddb-46c7-a87b-a23f14ded95d` | `3ab22e7faaf69fa2d572831ffc1db12252c6d569d3e1b54aecf56e075ba054c20fee83b2e013c9c3` |
| Partially adjudicated — Large REACH ACO (11,000 enrollees) | `2121efbd-98d2-4323-84db-974c8864abc7` | `ee1b0609f024a758bf1770ec16f809330d2ba8bb4e9004a7868c0258accfd69ced5b6448188abb7b` |

::: danger Protect your credentials
Use caution with 3rd party web-based REST clients. Sharing credentials with a third party allows them to make API calls on your behalf. This is a serious data privacy and security risk. Use secure REST client tools.
:::
