---
title: Get issue boards
---

## Get issue boards

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects?bimsync_project_id=71b7cefda7574e73beb80f23496f18b8
```

> Example response

```json
[
  {
    "project_id": "c0784b27-5057-43f6-bdb3-3607f4da86b0",
    "name": "Issue board 1",
    "bimsync_project_name": "My Catenda project",
    "bimsync_project_id": "71b7cefda7574e73beb80f23496f18b8",
    "bimsync_issue_board_name": "Issue board 1"
  },
  {
    "project_id": "5af9e867-659d-4eee-ae56-2370aaf8aabe",
    "name": "Issue board 2",
    "bimsync_project_name": "My Catenda project",
    "bimsync_project_id": "71b7cefda7574e73beb80f23496f18b8",
    "bimsync_issue_board_name": "Issue board 2"
  }
]
```

Return the issue boards you have access to.

The response also includes **bimsync_project_name**, **bimsync_project_id** and **bimsync_issue_board_name**.

Note: A Catenda project may have multiple issue boards. Use the **bimsync_project_id** query parameter to only return issue boards from the specified Catenda project.
Use **bimsync_archived** to filter issue boards based on their archived status.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects`

### Query Parameters

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th></th></tr>
    <tr>
        <td>bimsync_project_id</td>
        <td>string</td>
        <td>bimsync project id</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>bimsync_archived</td>
        <td>string</td>
        <td>archived, not-archived or all</td>
        <td>Optional, default is not-archived</td>
    </tr>
</table>

### Response schema

List of [project_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Project/project_GET.json)
