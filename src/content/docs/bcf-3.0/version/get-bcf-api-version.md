---
title: Get BCF API versions
---

## Get BCF API versions

Moved to `foundations` in official docs since v3.0, but still maintained in Catenda:
[foundations API](https://github.com/buildingSMART/foundation-API/blob/release_1_0/schemas/versions_GET.json)

> Example request

```http
GET https://api.catenda.com/opencde/foundation/versions
```

> Example response

```json
{
  "versions": [
    {
      "version_id": "2.0",
      "detailed_version": "Catenda BCF API 2.0 version. BCF-xml schema version: 2.0. Documentation: https://api.catenda.com/developers/reference/bcf/2.0"
    },
    {
      "version_id": "2.1",
      "detailed_version": "Catenda BCF API 2.1 version. BCF-xml schema version: 2.1. Documentation: https://api.catenda.com/developers/reference/bcf/v2_1."
    },
    {
      "version_id": "3.0",
      "detailed_version": "Catenda BCF API 3.0 version. BCF-xml schema version: 3.0. Documentation: https://api.catenda.com/developers/reference/bcf/v3_0."
    }
  ]
}
```

Return all available BCF REST API versions. A **version_id** must be added to underlying resource URLs. If **version_id** equals 3.0, then the project's URL will be https://api.catenda.com/opencde/foundation/1.0/projects.

This resource does not require any authorization.

### Resource URL

`https://api.catenda.com/opencde/foundation/versions`

### Response schema

[version_GET.json](https://github.com/buildingSMART/foundation-API/blob/release_1_0/schemas/versions_GET.json)
