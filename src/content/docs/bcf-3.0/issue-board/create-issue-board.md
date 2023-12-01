---
title: Create issue board
---

## Create issue board

> Example request

```http
POST https://api.catenda.com/opencde/bcf/3.0/projects
{
    "name": "My third BCF project",
    "bimsync_project_id": "08b7c8adf14a4805a2c34681ab3869af"
}
```

> Example response

```json
{
  "project_id": "485aa69d-8e25-4f68-9a97-04901b2288a7",
  "name": "My third BCF project",
  "bimsync_project_name": "My bimsync project",
  "bimsync_project_id": "08b7c8adf14a4805a2c34681ab3869af"
}
```

Note: The new issue board will be created in the project specified by the `bimsync_project_id` parameter.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th></th></tr>
    <tr>
        <td>name</td>
        <td>string</td>
        <td>name of the issue board to create</td>
        <td>Mandatory</td>
    </tr>
    <tr>
        <td>bimsync_project_id</td>
        <td>string</td>
        <td>Catenda project id</td>
        <td>Mandatory</td>
    </tr>
</table>
