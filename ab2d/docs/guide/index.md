---
description: Prerequisites for using the AB2D API, including eligibility, tool installation, and workflow overview.
---

# Prerequisites

## Who is eligible

Only active, stand-alone **Prescription Drug Plan (PDP) sponsors** can use the AB2D API. PACE and MAPD organizations are not eligible.

## Install curl and jq

You will need [curl](https://curl.se/) and [jq](https://jqlang.github.io/jq/) to interact with the API from the command line. curl may already be installed — run `curl --version` to check.

::: code-group
```sh [Mac]
brew install jq
# curl is pre-installed on macOS
```
```sh [Linux (yum)]
sudo yum install -y jq
# curl is typically pre-installed
```
```sh [Windows]
# Install Windows Subsystem for Linux (WSL), then follow the Linux instructions.
# See: https://learn.microsoft.com/en-us/windows/wsl/install
wsl --install
# After restarting, open Ubuntu from the Start menu and run:
sudo apt-get update -y && sudo apt-get install -y jq
```
:::

Verify installation:

```sh
curl --version
jq --version
```

If your OS is not listed, follow the installation guides on the [curl](https://curl.se/) and [jq](https://jqlang.github.io/jq/) websites.

## Workflow overview

The AB2D workflow follows the [Bulk Data Implementation Guide](https://hl7.org/fhir/uv/bulkdata/). Every interaction follows 4 steps:

1. **Authenticate** — Exchange your credentials for a bearer token (expires every 30 minutes)
2. **Start an export job** — Request Medicare claims data via the Export endpoint
3. **Check job status** — Poll the Status endpoint until the job completes
4. **Download files** — Retrieve the exported NDJSON files

## Sandbox vs. production

| | Sandbox | Production |
|---|---|---|
| **URL** | `sandbox.ab2d.cms.gov` | `api.ab2d.cms.gov` |
| **Identity Provider** | `test.idp.idm.cms.gov` | `idm.cms.gov` |
| **Credentials** | Public test credentials (below) | Issued by AB2D team after onboarding |
| **Data** | Synthetic claims data | Real Medicare enrollee data (PHI) |
| **Access** | Anyone | PDP sponsors with [production access](/guide/attest-and-onboard) only |

Both environments use the same endpoints and workflow.

## Glossary

**API (Application Programming Interface)**
: A set of protocols that allows software systems to communicate. The AB2D API is publicly documented and available to eligible PDP sponsors.

**Base64**
: An encoding format that converts credentials from text to a standard ASCII format for transmission. You encode your `clientID:password` in Base64 before authenticating.

**Identity Provider (IdP) / Okta**
: A service that verifies user identities. AB2D uses [Okta](https://www.okta.com/) as its IdP. You authenticate with Okta to receive a bearer token.

**Bearer token**
: An access token used during [OAuth 2.0](https://oauth.net/2/) authentication. You need a bearer token for every API request. Tokens expire after **30 minutes**.
