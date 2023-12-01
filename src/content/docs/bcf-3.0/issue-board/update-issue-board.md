---
title: Update issue board
---

## Update issue board

> Example request

```http
PUT https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e
{
    "name": "Change my project name",
}
```

> Example response

```json
{
  "project_id": "3c34c9b3-1b9b-4750-a4f3-0641d58fe48e",
  "name": "Change my project name",
  "bimsync_project_name": "My Catenda project",
  "bimsync_project_id": "08b7c8adf14a4805a2c34681ab3869af",
  "bimsync_issue_board_name": "Change my project name"
}
```

Update the name of the issue board

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/{project-id}`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>name</td>
        <td>string</td>
        <td>new name of the issue board</td>
        <td>Mandatory</td>
    </tr>
</table>

### Request schema

[project_PUT.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Project/project_PUT.json)

### Response schema

[project_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Project/project_GET.json)
