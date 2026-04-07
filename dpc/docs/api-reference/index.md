# API Reference

Quick-lookup reference for all DPC API endpoints. For detailed usage and examples, follow the links to the relevant guide section.

**Base URLs:**

::: code-group
```text [Sandbox]
https://sandbox.dpc.cms.gov/api/v1
```
```text [Production]
https://dpc.cms.gov/api/v1
```
:::

**All requests** (except `/Token/auth` and `/Token/validate`) require:

```
Authorization: Bearer {access_token}
```

## Authentication

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `POST` | `/Token/auth` | Exchange a signed JWT for an access token | [Get an access token](/guide/setup#get-an-access-token) |
| `POST` | `/Token/validate` | Validate JWT structure (does not verify signature) | [Validate your JWT](/guide/setup#validate-your-jwt-optional) |

## Client tokens

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `POST` | `/Token` | Create a client token | [Rotate a client token](/guide/build-integration#rotate-a-client-token) |
| `GET` | `/Token` | List all client tokens | [List client tokens](/guide/build-integration#list-client-tokens) |
| `DELETE` | `/Token/{id}` | Delete a client token | [Delete a client token](/guide/build-integration#delete-a-client-token) |

## Public keys

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `GET` | `/Key` | List all public keys | [List public keys](/guide/build-integration#list-public-keys) |
| `GET` | `/Key/{id}` | Get a specific public key | [List public keys](/guide/build-integration#list-public-keys) |
| `DELETE` | `/Key/{id}` | Delete a public key | [Delete a public key](/guide/build-integration#delete-a-public-key) |

## Organization

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `GET` | `/Organization` | Get your organization (returns Bundle) | [Find your Organization ID](/quickstart#step-2-find-your-organization-id) |
| `GET` | `/Organization/{id}` | Get a specific organization | [Find your Organization ID](/quickstart#step-2-find-your-organization-id) |

## Practitioners

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `POST` | `/Practitioner` | Register a single practitioner | [Add a practitioner](/guide/build-integration#add-a-practitioner) |
| `POST` | `/Practitioner/$submit` | Register practitioners in batch | [Add practitioners in batch](/guide/build-integration#add-practitioners-in-batch) |
| `GET` | `/Practitioner` | List all practitioners | [Look up a practitioner](/guide/build-integration#look-up-a-practitioner) |
| `GET` | `/Practitioner?identifier={npi}` | Find practitioner by NPI | [Look up a practitioner](/guide/build-integration#look-up-a-practitioner) |

## Patients

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `POST` | `/Patient` | Register a single patient | [Add a patient](/guide/build-integration#add-a-patient) |
| `POST` | `/Patient/$submit` | Register patients in batch | [Add patients in batch](/guide/build-integration#add-patients-in-batch) |
| `GET` | `/Patient` | List all patients | [Look up a patient](/guide/build-integration#look-up-a-patient) |
| `GET` | `/Patient?identifier={mbi}` | Find patient by MBI | [Look up a patient](/guide/build-integration#look-up-a-patient) |
| `GET` | `/Patient/{id}/$everything` | Export all data for one patient (synchronous) | [Single-patient export](/guide/build-integration#single-patient-export) |

## Groups (Attribution)

All group modification requests require the `X-Provenance` header. See [Attestation](/guide/build-integration#attestation).

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `POST` | `/Group` | Create an attribution group | [Create a roster](/guide/build-integration#create-a-roster) |
| `POST` | `/Group/{id}/$add` | Add patients to a group | [Add patients to a roster](/guide/build-integration#add-patients-to-a-roster) |
| `POST` | `/Group/{id}/$remove` | Remove patients from a group (sets inactive) | [Remove patients from a roster](/guide/build-integration#remove-patients-from-a-roster) |
| `PUT` | `/Group/{id}` | Replace entire group membership | [Replace an entire roster](/guide/build-integration#replace-an-entire-roster) |
| `DELETE` | `/Group/{id}` | Delete a group | [Delete a group](/guide/build-integration#delete-a-group) |
| `GET` | `/Group?characteristic-value=attributed-to${npi}` | Find group by practitioner NPI | [Find a group ID](/guide/build-integration#find-a-group-id) |
| `GET` | `/Group?characteristic-value=attributed-to${group_id}` | Get group details | [Refresh expired attributions](/guide/build-integration#refresh-expired-attributions) |

## Bulk data export

| Method | Endpoint | Description | Guide |
|---|---|---|---|
| `GET` | `/Group/{id}/$export` | Start a bulk export job | [Run a full export](/guide/build-integration#run-a-full-export) |
| `GET` | `/Group/{id}/$export?_type={types}` | Export specific resource types | [Export specific resource types](/guide/build-integration#export-specific-resource-types) |
| `GET` | `/Group/{id}/$export?_since={datetime}` | Export incremental updates | [Export incremental updates](/guide/build-integration#export-incremental-updates-with-since) |
| `GET` | `/Jobs/{id}` | Check export job status | [Check job status](/guide/build-integration#check-job-status) |
| `GET` | `/Data/{job_id}/{filename}` | Download exported data file | [Download results](/guide/build-integration#download-results) |

### Export request headers

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer {access_token}` | Yes |
| `Accept` | `application/fhir+json` | Yes (except `/Data` endpoint) |
| `Prefer` | `respond-async` | Yes (for `/Group/$export` only) |

### Available resource types for `_type`

| Type | Description |
|---|---|
| `ExplanationOfBenefit` | Claims history (diagnoses, procedures, medications, providers) |
| `Patient` | Demographics and identifiers |
| `Coverage` | Medicare enrollment (Part A, B, D) |
