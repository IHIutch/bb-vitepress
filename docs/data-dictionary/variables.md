---
title: Variables
description: CCW data dictionary variables used in Blue Button API extensions.
---

# Variables

Blue Button includes hundreds of Medicare-specific data points delivered as FHIR extensions. Each extension URL maps to a variable from the CMS Chronic Conditions Warehouse (CCW) data dictionary. This page explains how variables work and where to find their definitions.

## How variables appear in responses

Variables show up as extensions on FHIR resources. The extension URL is the variable identifier:

```json
{
  "extension": [
    {
      "url": "https://bluebutton.cms.gov/resources/variables/nch_near_line_rec_ident_cd",
      "valueCoding": {
        "code": "O",
        "display": "Part B physician/supplier claim record",
        "system": "https://bluebutton.cms.gov/resources/variables/nch_near_line_rec_ident_cd"
      }
    }
  ]
}
```

The `url` tells you which variable this is. The value type (`valueCoding`, `valueIdentifier`, `valueQuantity`, etc.) depends on the variable definition.

## Variable sources

Blue Button variables come from two sources:

### Codebook variables

The CCW codebook defines variables for fee-for-service claims, beneficiary enrollment, and prescription drug events. These are the traditional Medicare data dictionary variables.

| Codebook | Description |
|----------|-------------|
| Fee-For-Service Claims (FFS) | Variables for carrier, inpatient, outpatient, SNF, HHA, hospice, and DME claims |
| Medicare Beneficiary Summary File (MBSF) | Enrollment and demographic variables |
| Prescription Drug Events (PDE) | Part D pharmacy claim variables |

Each variable includes:
- **Name** — Short name (e.g., `nch_clm_type_cd`)
- **Label** — Human-readable description
- **Type** — Data type (CHAR, NUM, DATE)
- **Length** — Field length
- **Source** — Origin system (NCH, CWF, etc.)
- **Values** — Valid codes and their meanings

### RDA API variables

The Research Data Assistance Center (RDA) API provides additional variable definitions. These are documented in the [RDA API data dictionary](/assets/files/rda_api_data_dictionary.csv).

## Finding variable definitions

When you encounter an extension URL like `https://bluebutton.cms.gov/resources/variables/carr_clm_cntl_num`, you can:

1. Look it up on this site — variable detail pages are available at `/resources/variables/{variable_name}`
2. Search the [Blue Button extensions listing (CSV)](/assets/files/BB_V2_extension_listing.csv) for the URL
3. Reference the [CCW Data Dictionaries](https://www.ccwdata.org/web/tools/data-dictionaries) for source documentation

## Commonly used variables

| Variable | Description | Found in |
|----------|-------------|----------|
| `nch_clm_type_cd` | Claim type code | EOB.type |
| `nch_near_line_rec_ident_cd` | Record identification code | EOB.extension |
| `carr_num` | Carrier/MAC number | EOB.extension |
| `clm_freq_cd` | Claim frequency code | EOB.supportingInfo |
| `line_sbmtd_chrg_amt` | Submitted charge amount | EOB.item.adjudication |
| `line_alowd_chrg_amt` | Allowed charge amount | EOB.item.adjudication |
| `line_bene_pmt_amt` | Payment to beneficiary | EOB.item.adjudication |

For the complete list of variables and their value mappings, browse the individual variable pages or download the CSV listings above.
