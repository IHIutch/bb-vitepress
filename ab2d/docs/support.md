---
description: Get help with the AB2D API. Contact the team, browse FAQs, and find answers to common issues.
---

# Support

## Contact

Email [ab2d@cms.hhs.gov](mailto:ab2d@cms.hhs.gov) to ask questions or get help. The AB2D team will get back to you promptly.

When contacting the team, include:

- Your operating system
- The HTTP response code you received (if applicable)
- A description of the issue and which step you were on
- Any relevant logs

Join our [Google Group](https://groups.google.com/u/0/g/cms-ab2d-api) to give feedback and get notified about planned outages or API updates.

**Source code:** [github.com/CMSgov/ab2d](https://github.com/CMSgov/ab2d)

## Frequently Asked Questions

### Eligibility and access

<details>
<summary>Who is eligible to use AB2D?</summary>

Only active, stand-alone Medicare Prescription Drug Plan (PDP) sponsors are eligible. This excludes PACE and MAPD. PDP sponsors are private insurers that provide prescription drug benefits to Medicare enrollees.

</details>

<details>
<summary>How long do PDP sponsors have access?</summary>

PDP sponsors have access to AB2D as long as they have an active Attestor.

</details>

<details>
<summary>What happens if an Attestor leaves my organization?</summary>

Your organization must have an active Attestor at all times to access claims data. If your only Attestor leaves without a replacement, you will lose API access until another CEO, CFO, or COO attests.

Re-attestation restores access, including historical claims data that was not accessible during the lapse. It is strongly encouraged to add multiple Attestors to reduce the risk of gaps in data access.

</details>

<details>
<summary>What use of the data is permitted?</summary>

The [final rule](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745) specifies that data may be used for:

- Optimizing therapeutic outcomes through improved medication use
- Improving care coordination
- Fraud and abuse detection or compliance activities

The following uses are **not** permitted:

1. Inform coverage determinations under Part D
2. Conduct retroactive reviews of medically accepted indication(s) determinations
3. Facilitate enrollment changes to a different prescription drug plan or an MA-PD plan offered by the same parent organization
4. Inform marketing of benefits

[Learn more about permitted uses](/about/#what-you-cannot-do-with-it)

</details>

### Data

<details>
<summary>What data elements are available?</summary>

Medicare Parts A and B data elements include:

- Enrollee identifiers
- Diagnosis and procedure codes (e.g., ICD-10, HCPCS)
- Dates and places of service
- National Provider Identifier (NPI) numbers
- Claim processing and linking identifiers/codes (e.g., claim ID, claim type code)

[Download the Data Dictionary](/downloads/ab2d-data-dictionary.xlsx)

</details>

<details>
<summary>What is the data source?</summary>

AB2D receives data from the [Chronic Conditions Warehouse (CCW)](https://www2.ccwdata.org/web/guest/home/).

</details>

<details>
<summary>How can we get additional data elements?</summary>

AB2D evaluates data elements based on how well they support permitted uses defined in the [final rule](https://www.federalregister.gov/documents/2019/04/16/2019-06822/medicare-and-medicaid-programs-policy-and-technical-changes-to-the-medicare-advantage-medicare#page-15745). Any proposed changes would be established through rulemaking. Email [ab2d@cms.hhs.gov](mailto:ab2d@cms.hhs.gov) with feedback.

</details>

<details>
<summary>What does the "final" claim query code mean?</summary>

The "final" query code is a custom FHIR extension that indicates a final bill for payment. This does **not** necessarily mean the claim is finalized and complete. A claim object with a "final" query code can still be cancelled and resubmitted under a new claim ID.

Every time you pull data, you get the latest version of a claim. Claim objects have a `lastUpdated` field showing when AB2D received the update (not when it was submitted to Medicare). [Learn how to identify unique claim instances](/about/#understanding-claims-data).

</details>

### IP addresses and connectivity

<details>
<summary>How do I find my IP address?</summary>

From the system that will access the API, visit [http://checkip.amazonaws.com](http://checkip.amazonaws.com/). Or query from the command line:

::: code-group
```sh [Linux/Mac]
curl -X GET checkip.amazonaws.com
```
```powershell [Windows]
Invoke-RestMethod -Method GET checkip.amazonaws.com
```
:::

</details>

<details>
<summary>How many IP addresses can my organization add?</summary>

You can provide up to 8 IP addresses.

</details>

<details>
<summary>The IP address is incorrect. What should I do?</summary>

Check that you are using the correct system — the IP address should match what you gave to the AB2D team during onboarding. If the system is correct, check with your IT team to confirm you have a static IP address. If it is not static, it may have changed. You must have a static IP address to use the API.

</details>

<details>
<summary>How do I change or remove an IP address?</summary>

Contact the AB2D team at [ab2d@cms.hhs.gov](mailto:ab2d@cms.hhs.gov).

</details>

<details>
<summary>How do I test connectivity to AB2D?</summary>

::: code-group
```sh [Linux/Mac]
curl -X GET https://api.ab2d.cms.gov/health --verbose
```
```powershell [Windows]
Invoke-RestMethod -Method GET https://api.ab2d.cms.gov/health
```
:::

You can also visit the [AB2D Swagger UI](https://api.ab2d.cms.gov/swagger-ui/index.html) in a browser. A 200 response from the health endpoint means your IP address can connect.

</details>

### Jobs and downloads

<details>
<summary>Why is my job stuck at 0%?</summary>

You may be running too many jobs at once. If the API is busy, your job will be queued in a backlog.

</details>

<details>
<summary>How do I cancel a job?</summary>

::: code-group
```sh [Linux/Mac]
curl -X DELETE "https://api.ab2d.cms.gov/api/v2/fhir/Job/{job_uuid}/\$status" \
  -H "Authorization: Bearer ${bearer_token}"
```
```powershell [Windows]
Invoke-RestMethod -Method DELETE "https://api.ab2d.cms.gov/api/v2/fhir/Job/{job_uuid}/`$status" `
  -Headers @{ Authorization = "Bearer $bearer_token" }
```
:::

Replace `{job_uuid}` with your job ID. You can only cancel jobs that have not yet completed.

</details>

<details>
<summary>What response do I get when the job is complete?</summary>

A `200` response containing the list of files and their download URLs. See [API Reference — Status](/api-reference/#status) for the full response format.

</details>

<details>
<summary>What happens if the job fails?</summary>

The status endpoint returns an error for the job. Any files that were created are deleted. You cannot retrieve results from a failed job — you must restart it.

</details>

<details>
<summary>I got an error downloading files.</summary>

- **403 error:** Your bearer token may be expired or incorrect. Get a new token and retry.
- **4xx error:** Files may have been downloaded more than 6 times or expired (72 hours after job completion).

See [API Reference — HTTP Status Codes](/api-reference/#http-status-codes) for full troubleshooting details.

</details>

### FHIR versions

<details>
<summary>What are FHIR STU3 and R4?</summary>

STU3 and R4 are versions of the [Fast Healthcare Interoperability Resources (FHIR)](https://hl7.org/fhir/) standard for data transmission. AB2D provides [STU3](http://hl7.org/fhir/STU3/explanationofbenefit.html) and [R4](http://hl7.org/fhir/R4/explanationofbenefit.html) versions for the ExplanationOfBenefit resource type.

</details>

<details>
<summary>How does AB2D provide FHIR versions?</summary>

Version 1 of the API uses STU3 (`/api/v1/fhir`). Version 2, which is recommended, uses R4 (`/api/v2/fhir`). Requests are largely the same except for how parameters are processed. [Learn about the differences](/api-reference/#v1-differences).

[Download the STU3-R4 Migration Guide (XLSX)](https://github.com/CMSgov/ab2d-pdp-documentation/raw/main/AB2D%20STU3-R4%20Migration%20Guide%20Final.xlsx)

</details>

<details>
<summary>How are parameters different between v1 and v2?</summary>

In v1, `_since` defaults to January 1, 2020 (or your attestation date). In v2, `_since` defaults to the date of your last successful export. The `_until` parameter is only available in v2. [See the full comparison](/api-reference/#v1-differences).

</details>

## Related CMS APIs

- [Beneficiary Claims Data API (BCDA)](https://bcda.cms.gov/) — bulk claims data for Accountable Care Organizations
- [Blue Button 2.0](https://bluebutton.cms.gov/) — beneficiary-authorized access to claims data
- [Data at the Point of Care (DPC)](https://dpc.cms.gov/) — claims data for healthcare providers
