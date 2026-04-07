# Make Your First Request

This walkthrough takes you from "I have credentials" to "I got data back." Follow these steps in order using the sandbox environment.

## Prerequisites

Before starting, confirm you have:

- [x] A sandbox account ([sign up here](https://sandbox.dpc.cms.gov/users/sign_up))
- [x] A client token (created in the [DPC Portal](https://sandbox.dpc.cms.gov/users/sign_in))
- [x] A public key uploaded with a verified signature
<!-- TODO: Asset missing — jwt.html
- [x] The ability to generate JWTs (via the [JWT Tool](/downloads/jwt/jwt.html) or your own code)
-->

If you're missing any of these, complete the steps in [Set Up Your Environment](/guide/setup) first.

## Step 1: Get an access token

Generate a JWT and exchange it for an access token. This token expires in 5 minutes, so you'll need to repeat this step if it expires during the walkthrough.

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Token/auth" \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -X POST \
     -d "grant_type=client_credentials\
&scope=system%2F*.*\
&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer\
&client_assertion={your_signed_jwt}"
```

Save the `access_token` from the response — you'll use it in every subsequent request.

## Step 2: Find your Organization ID

Every API request is scoped to your organization. Retrieve your Organization ID:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Organization \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X GET
```

The response is a FHIR Bundle. Look for the `id` field in the Organization resource — save this value.

You can also find the Organization ID in the DPC Portal under each organization name.

## Step 3: Load sample practitioners

<!-- TODO: Asset missing — practitioner_bundle.json
DPC's sandbox has no preloaded test data. Download the [sample practitioner bundle](/downloads/practitioner_bundle.json) and upload it:
-->

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Practitioner/\$submit \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @practitioner_bundle.json
```

The response returns the registered practitioners. Note the **NPI** from one of the practitioners — you'll need it to create a group.

## Step 4: Load sample patients

<!-- TODO: Asset missing — patient_bundle.json
Download the [sample patient bundle](/downloads/patient_bundle.json) and upload it:
-->

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Patient/\$submit \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @patient_bundle.json
```

The response returns the registered patients. Note the **DPC ID** (the `id` field, a UUID) from at least two patients — you'll need these to create a group.

## Step 5: Create an attribution group

An attribution group links patients to a practitioner. This is how DPC knows which patients' data a practitioner is authorized to access.

First, create a `group.json` file. Replace the placeholder values with the NPI and patient IDs from the previous steps:

```json
{
  "resourceType": "Group",
  "type": "person",
  "actual": true,
  "characteristic": [
    {
      "code": {
        "coding": [
          {
            "code": "attributed-to"
          }
        ]
      },
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/sid/us-npi",
            "code": "{practitioner_npi}"
          }
        ]
      }
    }
  ],
  "member": [
    {
      "entity": {
        "reference": "Patient/{patient_dpc_id_1}"
      }
    },
    {
      "entity": {
        "reference": "Patient/{patient_dpc_id_2}"
      }
    }
  ]
}
```

Next, create an attestation — a Provenance resource that declares the practitioner has a treatment-related reason to access this data. Save this as your `X-Provenance` header value:

```json
{
  "resourceType": "Provenance",
  "meta": {
    "profile": [
      "https://dpc.cms.gov/api/v1/StructureDefinition/dpc-profile-attestation"
    ]
  },
  "recorded": "2024-01-01T00:00:00.000-05:00",
  "reason": [
    {
      "system": "http://hl7.org/fhir/v3/ActReason",
      "code": "TREAT"
    }
  ],
  "agent": [
    {
      "role": [
        {
          "coding": [
            {
              "system": "http://hl7.org/fhir/v3/RoleClass",
              "code": "AGNT"
            }
          ]
        }
      ],
      "whoReference": {
        "reference": "Organization/{organization_id}"
      },
      "onBehalfOfReference": {
        "reference": "Practitioner/{practitioner_id}"
      }
    }
  ]
}
```

Now post the group with the attestation:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}' \
     -X POST \
     -d @group.json
```

The response includes a Group resource with an `id` field — this is your **Group ID**. Save it for the next step.

## Step 6: Export data

Start a bulk export job for your attribution group:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/\$export \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Prefer: respond-async'
```

A successful request returns **202 Accepted** with a `Content-Location` header. The URL in this header contains your export job ID:

```
Content-Location: https://sandbox.dpc.cms.gov/api/v1/Jobs/{job_id}
```

## Step 7: Check status and download

Poll the job status using the URL from the `Content-Location` header:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Jobs/{job_id} \
     -H 'Authorization: Bearer {access_token}'
```

- **202 Accepted** — the job is still running. Wait a few seconds and try again.
- **200 OK** — the job is complete. The response body contains download URLs.

When the job completes, the response looks like this:

```json
{
  "transactionTime": "2024-01-15T14:47:33.975024Z",
  "request": "https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/$export",
  "requiresAccessToken": true,
  "output": [
    {
      "type": "ExplanationOfBenefit",
      "url": "https://sandbox.dpc.cms.gov/api/v1/Data/{job_id}/{file_name}.ndjson"
    },
    {
      "type": "Patient",
      "url": "https://sandbox.dpc.cms.gov/api/v1/Data/{job_id}/{file_name}.ndjson"
    },
    {
      "type": "Coverage",
      "url": "https://sandbox.dpc.cms.gov/api/v1/Data/{job_id}/{file_name}.ndjson"
    }
  ],
  "error": []
}
```

Download each file using the URLs in the `output` array:

```bash
curl https://sandbox.dpc.cms.gov/api/v1/Data/{job_id}/{file_name}.ndjson \
     -H 'Authorization: Bearer {access_token}'
```

::: tip
The Data endpoint is not a FHIR resource — it does not require the `Accept: application/fhir+json` header.
:::

## What you should see

Each downloaded file is in NDJSON format — one JSON object per line. You should see:

- **Patient file** — one record per patient in your group, with demographics and MBI
- **Coverage file** — one or more records per patient showing their Medicare Part A, B, and/or D enrollment
- **ExplanationOfBenefit file** — claims history for each patient, including diagnoses, procedures, providers, and dates of service

If you see data, congratulations — you've successfully connected to DPC.

See [Understand the Data](./) for a detailed breakdown of what each field means.

## Troubleshooting

**401 Unauthorized** — Your access token has expired (they last 5 minutes). Generate a new JWT and get a fresh access token.

**403 Forbidden** — Your client token may be invalid or your IP address may not be registered (production only).

**422 Unprocessable Entity** — Check that your Patient and Practitioner resources have all required fields (name, NPI/MBI, birthDate, gender).

<!-- TODO: Asset missing — patient_bundle.json
**Empty export results** — Make sure your patients' MBIs match synthetic records in the Beneficiary FHIR Data Server. Use the MBIs from the [sample patient bundle](/downloads/patient_bundle.json).
-->

**Job stuck at 202** — Large exports can take time. Wait and retry. If the job never completes, check that your group has active (non-expired) patient attributions.
