---
title: Authentication & OAuth
description: Set up OAuth 2.0 with PKCE for the Blue Button API, from sandbox credentials to token management.
---

# Authentication & OAuth

Blue Button uses OAuth 2.0 with PKCE. Your app redirects the user to Medicare.gov, they log in and grant consent, and you get an access token. Here's the full flow.

## How it works

1. Your app redirects the user to the Blue Button `/authorize` endpoint
2. The user logs into Medicare.gov and grants your app access
3. Blue Button redirects back to your app with an authorization code
4. Your app exchanges that code for an access token
5. You use the access token to call the API

## Set up your sandbox app

Before writing code, register an application in the sandbox:

1. Create an account at the [Blue Button Sandbox](https://sandbox.bluebutton.cms.gov/v1/accounts/create)
2. From the [Dashboard](https://sandbox.bluebutton.cms.gov/home), click **Add an Application**
3. Configure your app:

1. **Application Name** — Your app name
2. **OAuth Client Type** — Confidential
3. **Authorization Grant Type** — Authorization code
4. **Callback URLs / Redirect URIs** — Your callback URL (space-separated for multiple)
5. **Collect enrollee demographic data?** — Yes (to access Patient and UserInfo resources)

4. Click **Save Application** to get your **Client ID** and **Client Secret**

::: warning
Sandbox credentials only work in the sandbox environment. Production credentials require completing the [production access process](../production/requirements.md).
:::

## Get an authorization code

Redirect the user to the `/authorize` endpoint:

```
https://sandbox.bluebutton.cms.gov/v2/o/authorize/
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=http://localhost:8080/callback
  &response_type=code
  &state=RANDOM_STRING_AT_LEAST_16_CHARS
  &scope=openid%20profile%20patient/Patient.rs%20patient/Coverage.rs%20patient/ExplanationOfBenefit.rs
  &code_challenge=YOUR_CODE_CHALLENGE
  &code_challenge_method=S256
```

### Authorization parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes | Your application's client ID |
| `redirect_uri` | Yes | Must match a registered callback URL |
| `response_type` | Yes | Always `code` |
| `state` | Yes | Random string (16+ characters) to prevent CSRF |
| `scope` | No | Space-separated list of scopes (URL-encoded) |
| `code_challenge` | Yes | `BASE64URL(SHA256(code_verifier))` |
| `code_challenge_method` | Yes | Always `S256` |
| `lang` | No | `en` (English) or `es` (Spanish) for the authorization screen |

The user logs in at Medicare.gov, sees what data your app is requesting, and clicks **Connect**. Blue Button redirects back to your `redirect_uri` with a `code` and `state` parameter:

```
http://localhost:8080/callback?code=TSjqiZCdJwGyytGjz2GzziPfHTJ6z2&state=YOUR_STATE_VALUE
```

## Exchange the code for a token

```bash
curl -X POST "https://sandbox.bluebutton.cms.gov/v2/o/token/" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "code=TSjqiZCdJwGyytGjz2GzziPfHTJ6z2\
&grant_type=authorization_code\
&redirect_uri=http://localhost:8080/callback\
&code_verifier=YOUR_CODE_VERIFIER"
```

Response:

```json
{
  "access_token": "oQlduHNr09GKCU506GOgp8OarrAy2q",
  "expires_in": 36000,
  "token_type": "Bearer",
  "scope": "profile patient/Patient.rs patient/ExplanationOfBenefit.rs patient/Coverage.rs",
  "refresh_token": "wDimPGoA8vwXP51kie71vpsy9l17HN",
  "access_grant_expiration": "2026-09-05 19:17:53Z"
}
```

Access tokens expire after 1 hour. Use the refresh token to get new ones without requiring the user to log in again.

## Refresh a token

```bash
curl -X POST "https://sandbox.bluebutton.cms.gov/v2/o/token/" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=refresh_token&refresh_token=wDimPGoA8vwXP51kie71vpsy9l17HN"
```

::: warning
Each refresh token can only be used once. The response includes a new refresh token — store it for the next refresh.
:::

Response:

```json
{
  "access_token": "VD1VaT4IfjXAMlZTS9E4RVXZlkhYG7",
  "expires_in": 36000,
  "token_type": "Bearer",
  "scope": "profile patient/Patient.rs patient/Coverage.rs patient/ExplanationOfBenefit.rs",
  "refresh_token": "7x0VkRQlRU4fRNCQL2vh239nIyucgw",
  "patient": "-20140000000001",
  "access_grant_expiration": "2026-09-05 19:17:53Z"
}
```

::: tip
Not all apps receive refresh tokens. Applications in the "1 hour" access category get access tokens only — the user must re-authorize each session. Apps in the "13 months" and "Research" categories get refresh tokens.
:::

## Revoke a token

To revoke a user's access (for example, when they disconnect your app):

```bash
curl -X POST "https://api.bluebutton.cms.gov/v2/o/revoke/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "token=oQlduHNr09GKCU506GOgp8OarrAy2q"
```

The `/revoke` endpoint always returns `200`, whether or not the token exists.

## PKCE for mobile and native apps

Blue Button requires [PKCE (Proof Key for Code Exchange)](https://tools.ietf.org/html/rfc7636) on all authorization requests. PKCE ensures the app that started the OAuth flow is the same one finishing it.

Here's how it works:

1. Generate a random `code_verifier` (43-128 characters, URL-safe)
2. Compute the challenge: `code_challenge = BASE64URL(SHA256(code_verifier))`
3. Send `code_challenge` and `code_challenge_method=S256` in the `/authorize` request
4. Send the original `code_verifier` when exchanging the code for a token

For native apps, use a backend proxy server following the Backend For Frontend (BFF) pattern — the backend handles all token exchanges. See the sample apps for reference:

- [Node & React sample](https://github.com/CMSgov/bluebutton-sample-client-nodejs-react)
- [Python & React sample](https://github.com/CMSgov/bluebutton-sample-client-python-react)

## Scopes

Scopes control what data your app can access. Request scopes in the `/authorize` call.

| Scope | Access |
|-------|--------|
| `patient/Patient.rs` | Patient demographics (name, DOB, address) |
| `patient/Coverage.rs` | Medicare coverage and plan information |
| `patient/ExplanationOfBenefit.rs` | Claims data (the bulk of the data) |
| `profile` | Access to the `/UserInfo` endpoint |
| `openid` | Information about the currently logged-in user |
| `launch/patient` | Patient launch context |

::: tip
Even if you request the `patient/Patient.rs` scope, the enrollee can choose to deny access to their demographics during authorization. Build your app to handle a `403` response from the `/Patient` endpoint.
:::

## Token endpoints

::: code-group
```text [Sandbox]
https://sandbox.bluebutton.cms.gov/v2/o/token/
```
```text [Production]
https://api.bluebutton.cms.gov/v2/o/token/
```
:::

## Common errors

### `invalid_grant`

```json
{ "error": "invalid_grant" }
```

The authorization code or refresh token has already been used, or is invalid. Refresh tokens are single-use — if you've already used one, the user needs to re-authorize.

### `invalid_client`

```json
{ "error": "invalid_client" }
```

Client ID or secret is wrong, or your app doesn't have the right permissions. Double-check your credentials. If everything looks correct, email [BlueButtonAPI@cms.hhs.gov](mailto:BlueButtonAPI@cms.hhs.gov).

### Expired data access grant

```json
{
  "status_code": 400,
  "error": "invalid_grant",
  "error_description": "The authorization for accessing user data has expired. To refresh Medicare data, the end user must re-authenticate and consent to data sharing."
}
```

The user's access grant has expired. They need to go through the authorization flow again.

## Try it out

Two ways to quickly test the API without writing code:

- **[Test Client](https://sandbox.bluebutton.cms.gov/testclient/)** — Get a sample token in your browser and make API calls
<!-- TODO: Asset missing — CMS-BlueButton-2.0-API-Sandbox.postman_collection.json
- **[Postman collection](/assets/files/CMS-BlueButton-2.0-API-Sandbox.postman_collection.json)** — Import into Postman, add your client credentials, and start making requests
-->

For Postman, add these callback URLs to your sandbox app:

```
https://oauth.pstmn.io/v1/callback
https://oauth.pstmn.io/v1/browser-callback
```

Log in as a synthetic user: username `BBUser00000`, password `PW00000!`.

## SDKs

- [Node SDK](https://www.npmjs.com/package/cms-bluebutton-sdk)
- [Python SDK](https://pypi.org/project/cms-bluebutton-sdk/)

## Testing token expiration

In the sandbox, you can force-expire a user's access grant for testing:

```bash
curl -X POST "https://sandbox.bluebutton.cms.gov/v2/o/expire_authenticated_user/-20140000000001/" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -H "Content-Length: 0"
```

This simulates token expiration, access revocation, and grant expiration — all of which produce the same error responses.
