# Set Up Your Environment

This chapter walks you through going from zero to having authenticated access to the DPC API. By the end, you'll be able to make authenticated requests to the sandbox environment.

## Create your account

1. [Sign up for a sandbox account](https://sandbox.dpc.cms.gov/users/sign_up). Any Fee-for-Service provider organization or Health IT implementer can request access.
2. You'll receive a **confirmation email** from CMS upon account creation.
3. Once your account is assigned to an organization, you'll receive a **second email** with next steps and an invite to join the [DPC Google Group](https://groups.google.com/g/dpc-api).
4. Log in to the [DPC Portal](https://sandbox.dpc.cms.gov/users/sign_in) to create your first client token.

## Create a client token

Client tokens identify who is accessing the API through your account. You need a client token to create an access token, which is required with every API request.

::: warning
You MUST create different client tokens for every provider organization that works with the API.
:::

1. Log in to your account in the [DPC Portal](https://sandbox.dpc.cms.gov/users/sign_in) and select **+ New Token**.
2. Add a label — title your token with a recognizable name that includes the environment.
3. Click "Create Token" to generate your client token.

<!-- TODO: Asset missing — guide_client_token.svg
![Client Token](/images/guide_client_token.svg)
-->

::: danger
This is the only time this client token will be visible to you. Copy it and store it in a safe, durable location.
:::

## Upload a public key

Public keys verify that requests are coming from an authorized application. DPC checks that the private key used to sign your JSON Web Token (JWT) matches a public key you've uploaded. All files in this section must be stored in one folder.

### 1. Generate a private key

This creates a 4096-bit RSA key pair. The private key is what you'll use to sign JWTs — it proves your identity to DPC.

```bash
openssl genrsa -out private.pem 4096
```

::: warning
Your private key (`private.pem`) is sensitive. Treat it like a password — never share it, commit it to version control, or send it over email.
:::

### 2. Generate a public key

This extracts the public half of your key pair. You'll upload this to DPC so it can verify your signed JWTs.

```bash
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

### 3. Upload your public key

Paste the full contents of `public.pem` into the "Public Key" field in the DPC Portal. Include the `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` tags.

<!-- TODO: Asset missing — guide_public_key_ex.svg
![Public Key Example - Shows public key with the BEGIN PUBLIC KEY and END PUBLIC KEY tags.](/images/guide_public_key_ex.svg)
-->

Give your public key a descriptive label.

### 4. Create a public key signature

DPC needs to verify you actually hold the private key that matches the public key you're uploading. You do this by signing a challenge file.

**Download the snippet file:**

```bash
curl -JLO https://raw.githubusercontent.com/CMSgov/dpc-app/main/dpc-web/public/snippet.txt
```

On Mac or Linux, verify the file type:

```bash
file snippet.txt
# Must return: snippet.txt: ASCII text, with no line terminators
```

**Sign the snippet with your private key:**

```bash
openssl dgst -sign private.pem -sha256 -out snippet.txt.sig snippet.txt
```

**Verify the signature is valid:**

```bash
openssl dgst -verify public.pem -sha256 -signature snippet.txt.sig snippet.txt
# Must return: Verified Ok
```

**Base64-encode the signature for upload:**

```bash
openssl base64 -in snippet.txt.sig -out signature.sig
```

Paste the contents of `signature.sig` into the "Public Key Signature" field in the DPC Portal, then click **Add Key**.

::: tip
If you see "Unable to verify your public key," re-download `snippet.txt` and regenerate the key/signature pair from scratch.
:::

## Generate a JWT

A JSON Web Token (JWT) authenticates your organization with DPC. You have two options:

### Option A: Use the JWT Tool

<!-- TODO: Asset missing — jwt.html
Download the [JWT Tool](/downloads/jwt/jwt.html) — a standalone HTML page that generates JWTs locally. Your information is not sent over the network.
-->

1. Input your private key.
2. Input your client token.
3. Input your public key ID (found under "Public Keys" in the DPC Portal).
4. Click "Generate JWT".
5. Copy the generated JWT.

### Option B: Build your own JWT

**Payload:**

```json
{
  "iss": "{client_token}",
  "sub": "{client_token}",
  "aud": "https://sandbox.dpc.cms.gov/api/v1/Token/auth",
  "exp": "{current datetime + 5 minutes}",
  "jti": "{unique_id}"
}
```

**Header:**

```json
{
  "alg": "RS384",
  "kid": "{public_key_id}"
}
```

Sign the JWT using your private key with the RS384 algorithm.

### Validate your JWT (optional)

The `/Token/validate` endpoint checks that your JWT has the correct structure:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Token/validate \
     -H 'Accept: application/json' \
     -H 'Content-Type: text/plain' \
     -X POST \
     -d "{signed_jwt}"
```

A 200 response means the structure is valid.

::: warning
This endpoint only validates structure — it does NOT verify the signature, public key, or client token. A successful response here does not guarantee the JWT will work for authentication.
:::

## Get an access token

This is the final step. Exchange your signed JWT for an access token by POSTing to the `/Token/auth` endpoint.

::: danger
Access tokens expire after **5 minutes**. Your JWT must also have a 5-minute expiration. You'll need to generate new tokens regularly.
:::

**Request parameters** (form-encoded):

| Parameter | Value | Notes |
|---|---|---|
| `scope` | `system/*.*` | Fixed — must match or be less than originally granted scope |
| `grant_type` | `client_credentials` | Fixed |
| `client_assertion_type` | `urn:ietf:params:oauth:client-assertion-type:jwt-bearer` | Fixed |
| `client_assertion` | `{signed_jwt}` | Your signed JWT |

**cURL command:**

::: code-group
```bash [Sandbox]
curl -v "https://sandbox.dpc.cms.gov/api/v1/Token/auth" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -X POST \
     -d "grant_type=client_credentials\
&scope=system%2F*.*\
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer\
&client_assertion={signed_jwt}"
```
```bash [Production]
curl -v "https://dpc.cms.gov/api/v1/Token/auth" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -X POST \
     -d "grant_type=client_credentials\
&scope=system%2F*.*\
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer\
&client_assertion={signed_jwt}"
```
:::

**Response:**

```json
{
  "access_token": "{access_token_value}",
  "token_type": "bearer",
  "expires_in": 300,
  "scope": "system/*.*"
}
```

Use the `access_token` value as your bearer token in subsequent requests:

```
Authorization: Bearer {access_token_value}
```

You can create multiple access tokens from the same JWT. Once an access token expires, generate a new JWT and repeat this step.

### Sample JavaScript code

```javascript
const jsrsasign = require('jsrsasign')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

var dt = new Date().getTime();
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return (c=='x' ? r :(r&0x3|0x8)).toString(16);
});

var data = {
    "iss": "{client_token}",       // Your client token from the DPC Portal
    "sub": "{client_token}",       // Same value as "iss"
    "aud": "https://sandbox.dpc.cms.gov/api/v1/Token/auth",
    "exp": Math.round(new Date().getTime() / 1000) + 300,
    "iat": Math.round(Date.now()),
    "jti": uuid,
};

var secret = "-----BEGIN RSA PRIVATE KEY-----\n" +
   // Your private key contents here
   "-----END RSA PRIVATE KEY-----\n";

const header = {
    'alg': 'RS384',
    'kid': '{public_key_id}',      // Your public key ID from the DPC Portal
}

var sPayload = JSON.stringify(data);
var sJWT = jsrsasign.jws.JWS.sign("RS384", header, sPayload, secret);

fetch('https://sandbox.dpc.cms.gov/api/v1/Token/auth', {
    method: 'POST',
    header: 'ACCEPT: application/json',
    body: new URLSearchParams({
        scope: "system/*.*",
        grant_type: "client_credentials",
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: sJWT
    })
}).then(response => {
    if (response.ok) {
        response.json().then(json => {
            console.log(json);
        });
    }
});
```

## Register IP addresses (production only)

::: info
This step is only required for production access. Skip this for sandbox testing.
:::

In the [DPC Portal](https://dpc.cms.gov), provide the public IPv4 addresses of the systems that will access production data.

- Maximum of **8 IP addresses**
- Only **IPv4** addresses are accepted (format: `XXX.XXX.XX.XX`)
- IP address **ranges are not supported**

## Sandbox vs. production

| | Sandbox | Production |
|---|---|---|
| **Base URL** | `https://sandbox.dpc.cms.gov` | `https://dpc.cms.gov` |
| **Portal** | [sandbox.dpc.cms.gov/users/sign_in](https://sandbox.dpc.cms.gov/users/sign_in) | [dpc.cms.gov](https://dpc.cms.gov) |
| **Data** | Synthetic (fake) | Real Medicare FFS claims |
| **IP registration** | Not required | Required (up to 8 IPv4 addresses) |
| **Application review** | Not required — self-service sign-up | Required — CMS reviews your application |
| **Security certification** | Not required | Required (ONC, HITRUST, SOC 2, etc.) |
| **Unique tokens per org** | Yes | Yes |
