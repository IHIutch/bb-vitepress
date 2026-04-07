---
title: Quickstart
description: Go from zero to your first Blue Button API response in 5 minutes.
---

# Quickstart

Get your first Blue Button API response in 5 minutes. You'll create a sandbox account, get an access token, and fetch a Patient resource.

## 1. Create a sandbox account

Go to the [Blue Button Sandbox](https://sandbox.bluebutton.cms.gov/v1/accounts/create) and create an account.

## 2. Register an application

1. From the [Sandbox Dashboard](https://sandbox.bluebutton.cms.gov/home), click **Add an Application**.
2. Fill in the required fields:

| Field | Value |
|-------|-------|
| Application Name | Anything you want |
| OAuth Client Type | Confidential |
| Authorization Grant Type | Authorization code |
| Callback URLs / Redirect URIs | `http://localhost:8080/callback` |
| Collect enrollee demographic data? | Yes |

3. Click **Save Application**. You'll get a **Client ID** and **Client Secret**. Keep these — you'll need them in the next step.

## 3. Get an access token

The fastest way to get a token for testing is the Blue Button Test Client:

1. Open the [Test Client](https://sandbox.bluebutton.cms.gov/testclient/).
2. Click **Get a Sample Authorization Token**.
3. Click **Authorize as a Beneficiary**.
4. Log in with a synthetic user: username `BBUser00000`, password `PW00000!`.
5. Click **Connect** to grant access.
6. Copy the access token from the JSON response.

::: tip
The test client gives you a quick token for trying the API. For real apps, you'll implement the full OAuth flow — see the [Authentication guide](./guide/authentication-and-oauth.md).
:::

## 4. Fetch a Patient resource

Replace `<YOUR_ACCESS_TOKEN>` with the token you just copied:

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Patient" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

## 5. See the response

You'll get back a FHIR Bundle containing the patient's demographics:

```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 1,
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "-20140000000001",
        "identifier": [
          {
            "system": "https://bluebutton.cms.gov/resources/variables/bene_id",
            "value": "-20140000000001"
          }
        ],
        "name": [
          {
            "use": "usual",
            "family": "Doe",
            "given": ["Jane"]
          }
        ],
        "gender": "female",
        "birthDate": "1999-06-01",
        "address": [
          {
            "state": "FL",
            "postalCode": "33143"
          }
        ]
      }
    }
  ]
}
```

That's it — you just pulled a Medicare patient record from the sandbox.

## Try the other resources

Now fetch this patient's claims and coverage data:

```bash
# Coverage — insurance and plan information
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/Coverage" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"

# ExplanationOfBenefit — all processed claims
curl "https://sandbox.bluebutton.cms.gov/v2/fhir/ExplanationOfBenefit" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

::: warning
ExplanationOfBenefit responses can be large — a single patient may have hundreds of claims. The response is paginated. See [Handling Pagination](./guide/handling-pagination.md) for how to work through all pages.
:::

## What's next

- [Authentication & OAuth](./guide/authentication-and-oauth.md) — implement the full OAuth flow in your app
- [Fetching Patient Data](./guide/fetching-patient-data.md) — understand the response structure and work with identifiers
- [Working with Claims](./guide/working-with-claims.md) — decode ExplanationOfBenefit responses
- [API Reference](./api-reference/index.md) — full endpoint documentation
