# Build Your Integration

This chapter covers the full set of operations for building a production-quality DPC integration. It's organized by task — what you need to do, not which endpoint to call.

For a quick end-to-end walkthrough, see [Make Your First Request](/quickstart) first.

## Managing practitioners

Every organization must maintain a list of practitioners authorized to access DPC data.

### Add a practitioner

Create a FHIR Practitioner resource as a JSON file. At minimum, include:

- First and last name
- Type 1 National Provider Identifier (NPI)

::: tip
If a practitioner with the same NPI already exists, the endpoint returns the existing practitioner rather than creating a duplicate.
:::

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Practitioner \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @practitioner.json
```

### Add practitioners in batch

<!-- TODO: Asset missing — practitioner_bundle.json
Use the `$submit` operation to upload multiple practitioners at once. Download the [sample practitioner bundle](/downloads/practitioner_bundle.json) for the expected format.
-->

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Practitioner/\$submit \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @practitioner_bundle.json
```

### Look up a practitioner

**List all practitioners:**

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Practitioner \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X GET
```

**Find by NPI:**

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Practitioner?identifier={npi}" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X GET
```

## Managing patients

Every organization must maintain a list of patients currently being treated at your facilities.

### Add a patient

Create a FHIR Patient resource as a JSON file. At minimum, include:

- First and last name
- Birth date (`YYYY-MM-DD`)
- Gender (must match CMS records)
- Medicare Beneficiary Identifier (MBI) using either identifier system:

     ```json
     { "system": "http://hl7.org/fhir/sid/us-mbi", "value": "{mbi}" }
     ```

     or

     ```json
     { "system": "https://bluebutton.cms.gov/resources/variables/bene_id", "value": "{mbi}" }
     ```

- Managing Organization reference:

     ```json
     { "managingOrganization": { "reference": "Organization/{org_id}" } }
     ```

::: tip
If a patient with the same MBI already exists, the endpoint returns the existing patient rather than creating a duplicate.
:::

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Patient \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @patient.json
```

### Add patients in batch

<!-- TODO: Asset missing — patient_bundle.json
Use the `$submit` operation. Download the [sample patient bundle](/downloads/patient_bundle.json) for the expected format.
-->

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Patient/\$submit \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X POST \
     -d @patient_bundle.json
```

### Look up a patient

**List all patients:**

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Patient \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X GET
```

**Find by MBI:**

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Patient?identifier={mbi}" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X GET
```

## Attestation

CMS requires practitioners to attest they have a treatment-related purpose for accessing a patient's data. This is a HIPAA requirement — data can only be shared between covered entities for treatment purposes as defined under 45 C.F.R. § 164.506.

Attestation is submitted as a [Provenance](https://www.hl7.org/fhir/provenance.html) resource in the `X-Provenance` header. You must include this header whenever you create or modify a group.

At minimum, the attestation must include:

- **Timestamp** — when the attestation was made
- **Reason** — must be `TREAT` (only supported value)
- **Organization ID** — found in the DPC Portal or via `GET /Organization`
- **Practitioner ID** — the DPC UUID of the practitioner (from the `id` field when you registered them)

### Example attestation

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

## Managing attribution groups

An attribution group (or roster) links patients to a practitioner. This determines which patients' data a practitioner can export.

::: warning
Attribution groups must be updated every **90 days**. When a patient's attribution expires, their `inactive` flag is set to `true` and they are excluded from bulk data exports. Re-attribute the patient to renew access.
:::

::: warning
Do not use Parameter or Bundle resources when adding, updating, or overwriting groups.
:::

### Create a roster

Create a `group.json` file with the practitioner's NPI and patient DPC IDs (UUIDs), then POST with the `X-Provenance` header:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}' \
     -X POST \
     -d @group.json
```

The response includes `period` and `inactive` fields for each patient, showing their attribution start/end dates and whether the relationship is active.

### Add patients to a roster

Use the `$add` operation to add patients to an existing group:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/\$add \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}' \
     -X POST \
     -d @group_addition.json
```

### Remove patients from a roster

Use the `$remove` operation. This does **not** delete the patient — it sets their `inactive` flag to `true`.

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/\$remove \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -X POST \
     -d @group_removal.json
```

### Refresh expired attributions

After 90 days, patient attributions expire. To identify expired patients, retrieve the group and check for patients with attribution dates older than 90 days:

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Group?characteristic-value=attributed-to\${group_id}" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json'
```

Re-attribute expired patients by adding them back to the group with a fresh attestation using `$add`.

### Replace an entire roster

Use PUT to completely overwrite a group's membership. This does **not** merge — it replaces everything.

::: danger
This endpoint completely replaces the current membership. Any patients not included in the new resource will be removed.
:::

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id} \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}' \
     -X PUT \
     -d @updated_group.json
```

### Find a group ID

Look up a group by practitioner NPI:

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Group?characteristic-value=attributed-to\${practitioner_npi}" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json'
```

The Group ID is the `id` field in the returned Group resource.

### Delete a group

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id} \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Content-Type: application/fhir+json' \
     -X DELETE
```

## Exporting data

The primary way to get data from DPC is the FHIR `/Group/$export` operation — an asynchronous bulk export.

### Run a full export

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/\$export \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Prefer: respond-async'
```

Returns **202 Accepted** with a `Content-Location` header containing the job URL.

### Export specific resource types

Use the `_type` parameter to limit which resources are exported:

```bash
# Only Patient and Coverage (no EoB)
GET /api/v1/Group/{group_id}/$export?_type=Patient,Coverage

# Only Explanation of Benefit
GET /api/v1/Group/{group_id}/$export?_type=ExplanationOfBenefit
```

If omitted, all three types (ExplanationOfBenefit, Patient, Coverage) are exported.

### Export incremental updates with `_since`

Use the `_since` parameter to get only data updated after a specific date. Dates must be in [FHIR Instant format](https://www.hl7.org/fhir/datatypes.html#instant): `YYYY-MM-DDThh:mm:sss[-/+]zz:zz`.

::: tip Before using `_since` for the first time
Run an unfiltered export first to retrieve all historical data. Then use the `transactionTime` from that export as your `_since` date for subsequent calls.
:::

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Group/{group_id}/\$export?_type=Patient&_since=2024-01-15T08:00:00.000-05:00" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'Prefer: respond-async'
```

::: warning
When using Postman, manually encode `+` as `%2B` in the `_since` parameter — Postman does not auto-encode this character.
:::

### Check job status

Poll the job URL from the `Content-Location` header:

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Jobs/{job_id} \
     -H 'Authorization: Bearer {access_token}'
```

- **202 Accepted** — still processing
- **200 OK** — complete, response body contains download URLs

The response includes file integrity data (SHA256 checksum and file length) in the `extension` array for each output file.

### Download results

Fetch each file URL from the `output` array:

```bash
curl https://sandbox.dpc.cms.gov/api/v1/Data/{job_id}/{file_name}.ndjson \
     -H 'Authorization: Bearer {access_token}'
```

::: tip
The Data endpoint is not a FHIR resource — it does not require `Accept: application/fhir+json`.
:::

If errors occurred during export, they appear in the `error` array as NDJSON files containing FHIR [OperationOutcome](http://hl7.org/fhir/STU3/operationoutcome.html) resources.

## Single-patient export

The `Patient/$everything` endpoint retrieves all data for a single patient as a synchronous request — no job monitoring needed. It returns Patient, Coverage, and ExplanationOfBenefit resources from the last seven years in a single Bundle.

Use this when you need data for one specific patient rather than a full roster export.

**Requirements:**
- The patient must already exist in DPC (but does not need to belong to a group)
- You need the patient's DPC internal UUID (not their MBI) — retrieve it via `GET /Patient?identifier={mbi}`
- An `X-Provenance` header is required (unlike the `/Group/$export` endpoint)

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Patient/{dpc_uuid}/\$everything \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}'
```

The response body contains the Bundle directly (no `Content-Location` header, no job polling).

You can also use the `_since` parameter with `Patient/$everything` to filter by date:

```bash
curl -v "https://sandbox.dpc.cms.gov/api/v1/Patient/{dpc_uuid}/\$everything?_since=2024-01-15T08:00:00.000-05:00" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/fhir+json' \
     -H 'X-Provenance: {provenance_json}'
```

## Managing tokens and keys

Once your integration is running, you'll periodically need to rotate credentials.

### Rotate a client token

Create a new token via the DPC Portal or the API:

```bash
curl -d '' -v "https://sandbox.dpc.cms.gov/api/v1/Token?label={name}" \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -H 'Content-Type: application/json' \
     -X POST
```

Optional parameters:

| Parameter | Value | Description |
|---|---|---|
| `label` | any string | Human-readable name for the token |
| `expiration` | ISO datetime | Custom expiration (max 5 minutes) |

### List client tokens

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Token \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -X GET
```

### Delete a client token

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Token/{token_id} \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -X DELETE
```

### List public keys

**All keys:**

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Key \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -X GET
```

**Specific key:**

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Key/{key_id} \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -X GET
```

### Delete a public key

```bash
curl -v https://sandbox.dpc.cms.gov/api/v1/Key/{key_id} \
     -H 'Authorization: Bearer {access_token}' \
     -H 'Accept: application/json' \
     -X DELETE
```

## Using the Postman collection

<!-- TODO: Asset missing — postman.zip
Download the [Postman collection](/downloads/postman.zip) for ready-to-use example requests.
-->

**Setup:**

1. Import the collection into [Postman](https://www.postman.com/).
2. Select the **Data at the Point of Care Sandbox** environment (top right).
3. Set `key_id` to your public key's DPC ID (returned when you uploaded your key).
4. Add these values to your [Postman vault](https://learning.postman.com/docs/sending-requests/postman-vault/postman-vault-secrets/):
   - `client_token` — your client token
   - `PRIVATE_KEY` — your private key
5. In vault settings, enable **"Enable support in scripts."**

The collection automatically generates a fresh JWT and access token before each request, so you don't need to manually refresh tokens every 5 minutes.

Each request in the collection includes a description (click the dropdown arrow next to the request title to view it).
