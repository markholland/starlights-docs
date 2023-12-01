---
title: Authentication
---

# Authentication

Authentication is based on the [OAuth 2.0 Protocol](http://tools.ietf.org/html/draft-ietf-oauth-v2-22).
First you must retrieve the **oauth2_auth_url** and the **oauth2_token_url**.

## Get authentication URLs

> Example request

```http
GET https://api.catenda.com/opencde/foundation/1.0/auth
```

> Example response

```json
{
  "oauth2_auth_url": "https://api.catenda.com/oauth2/authorize",
  "oauth2_token_url": "https://api.catenda.com/oauth2/token",
  "http_basic_supported": "false",
  "supported_oauth2_flows": ["authorization_code_grant"]
}
```

Follow [Catenda authentication documentation](/) to retrieve the access token.

When requesting other resources the access token must be passed via the _Authorization_ header using the _Bearer_ scheme (e.g. `Authorization: Bearer T9UNRV4sC9vr7ga`)

Returns the **oauth2_auth_url**, the **oauth2_token_url**.

### Resource URL

`https://api.catenda.com/opencde/foundation/foundation_version_id/auth`

### Response schema

[auth_GET.json](https://github.com/buildingSMART/foundation-API/blob/release_1_0/schemas/auth_GET.json)
