---
title: Get comment
---

## Get comment

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e/topics/6411ce04-5391-40a6-97c2-be0ca45fcc96/comments/d13fd9fa-2f54-4bbd-b37d-15a975077cd3?includeAuthorization=true
```

> Example response

```json
{
  "guid": "d13fd9fa-2f54-4bbd-b37d-15a975077cd3",
  "date": "2017-06-02T09:57:44.438+0000",
  "author": "user2@test.com",
  "comment": "Check this",
  "topic_guid": "6411ce04-5391-40a6-97c2-be0ca45fcc96",
  "viewpoint_guid": "9d3b9d8e-68a8-4f15-bf1e-37fb6bbaf0d5",
  "reply_to_comment_guid": "e93582cc-fb27-4472-8d90-9db9a7a66780",
  "modified_date": "2018-03-14T15:45:34.448+0000",
  "modified_author": "user3@test2.com",
  "authorization": ["update"]
}
```

Return the comment.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/comments/{comment_guid}`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>includeAuthorization</td>
        <td>boolean</td>
        <td>whether to return the authorization object</td>
        <td>Optional</td>
    </tr>
</table>

### Response schema

[comment_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Comment/comment_GET.json)
