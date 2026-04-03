---
title: UserInfo
description: API reference for the UserInfo endpoint — authenticated user details.
---

# UserInfo

The UserInfo endpoint returns basic information about the authenticated user. It's an OAuth 2.0 protected resource, not a FHIR endpoint.

::: tip
Users can deny access to personal information during authorization. If they do, this endpoint returns `You do not have permission.`
:::

## GET /v2/connect/userinfo

```bash
curl "https://sandbox.bluebutton.cms.gov/v2/connect/userinfo" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Parameters

None. The endpoint identifies the user from the access token.

### Required scopes

- `profile` — Required to access this endpoint
- `openid` — Required for user identification

## Response

```json
{
  "sub": "-20140000000001",
  "preferred_username": "BBUser00000",
  "given_name": "Jane",
  "family_name": "Doe",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "created": "2020-01-15",
  "patient": "-20140000000001"
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `sub` | string | Subject identifier (matches Patient resource ID) |
| `preferred_username` | string | Medicare.gov username |
| `given_name` | string | First name |
| `family_name` | string | Last name |
| `name` | string | Full name |
| `email` | string | Email address |
| `created` | date | Account creation date |
| `patient` | string | Patient resource ID (use this to query FHIR endpoints) |

## Errors

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 401 | Invalid or expired access token |
| 403 | User denied access to personal information |
