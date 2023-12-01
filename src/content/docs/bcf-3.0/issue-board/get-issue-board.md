---
title: Get issue board
---

## Get issue board

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e
```

> Example response

```json
{
  "project_id": "3c34c9b3-1b9b-4750-a4f3-0641d58fe48e",
  "name": "My BCF project",
  "bimsync_project_name": "My Catenda project",
  "bimsync_project_id": "08b7c8adf14a4805a2c34681ab3869af",
  "bimsync_issue_board_name": "My BCF project"
}
```

Return the issue board.

The response includes **bimsync_project_name**, **bimsync_project_id** and **bimsync_issue_board_name**.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id`

### Response schema

[project_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Project/project_GET.json)
