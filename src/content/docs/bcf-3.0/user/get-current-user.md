---
title: Get current user
---

## Get current user

> Example request

```http
GET https://api.catenda.com/opencde/foundation/1.0/current-user
```

> Example response

```json
{
  "name": "User 1",
  "id": "user1@test.com"
}
```

Return the current user.

Users have 2 attributes. **name** and **id**.
**name** is the name of the user.
**id** is the email-address of the user.

### Resource URL

`https://api.catenda.com/opencde/foundation/foundation_version_id/current-user`

### Response schema

[user_GET.json](https://github.com/buildingSMART/foundation-API/blob/release_1_0/schemas/user_GET.json)
