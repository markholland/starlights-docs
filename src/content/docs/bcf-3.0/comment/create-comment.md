---
title: Create comment
---

## Create comment

> Example request

```http
POST https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/comments
{
    "comment": "will rework the heating model",
    "viewpoint_guid": "c771d62e-0937-4164-b064-8c3b925ef70b"
}
```

> Example response

```json
{
  "guid": "970e02db-75a8-4b95-a852-0d9ef583ef55",
  "date": "2020-02-28T09:33:27.299+0000",
  "author": "king@test.com",
  "comment": "will rework the heating model",
  "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
  "viewpoint_guid": "c771d62e-0937-4164-b064-8c3b925ef70b"
}
```

Create the comment.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/comments`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>guid</td>
        <td>string</td>
        <td>the guid of the comment</td>
        <td>Optional, if set: requires the guid not to exist in the project</td>
    </tr>
    <tr>
        <td>comment</td>
        <td>string</td>
        <td>the comment</td>
        <td>Mandatory</td>
    </tr>
    <tr>
        <td>viewpoint_guid</td>
        <td>string</td>
        <td>guid of an existing viewpoint</td>
        <td>Optional</td>
    </tr>
</table>

### Request schema

[comment_POST.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Comment/comment_POST.json)

### Response schema

[comment_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Comment/comment_GET.json)
