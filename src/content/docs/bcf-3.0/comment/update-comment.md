---
title: Update comment
---

## Update comment

> Example request

```http
PUT https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/comments/587bd028-33a1-4b7e-b450-3f39e42e86c5
{
    {
        "comment": "updated the comment",
        "viewpoint_guid": ""
    }
}
```

> Example response

```json
{
  "guid": "587bd028-33a1-4b7e-b450-3f39e42e86c5",
  "date": "2020-02-27T14:42:08.390+0000",
  "author": "king@test.com",
  "comment": "updated the comment",
  "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
  "modified_date": "2020-02-28T09:38:16.750+0000",
  "modified_author": "king@test.com"
}
```

Edit the comment.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/comments`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>   
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
