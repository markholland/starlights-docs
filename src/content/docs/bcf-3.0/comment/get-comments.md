---
title: Get comments
---

## Get comments

> Example request

```http
    GET https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/comments?includeAuthorization=true
```

> Example response

```json
[
  {
    "guid": "587bd028-33a1-4b7e-b450-3f39e42e86c5",
    "date": "2020-02-27T14:42:08.390+0000",
    "author": "king@test.com",
    "comment": "A comment!",
    "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
    "modified_date": "2020-02-27T14:42:14.760+0000",
    "modified_author": "king@test.com",
    "authorization": {
      "comment_actions": ["update"]
    }
  },
  {
    "guid": "8609f137-c481-47af-819a-d139bb891265",
    "date": "2020-02-27T14:43:41.010+0000",
    "author": "king@test.com",
    "comment": "This is an edited comment",
    "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
    "modified_date": "2020-02-27T14:48:05.417+0000",
    "modified_author": "king@test.com",
    "authorization": {
      "comment_actions": ["update"]
    }
  },
  {
    "guid": "ae2c9958-76d9-42e5-b400-547d0e735134",
    "date": "2020-02-27T14:44:03.152+0000",
    "author": "pawn@test.com",
    "comment": "There's a comment",
    "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
    "authorization": {
      "comment_actions": []
    }
  },
  {
    "guid": "e79ab6dd-6fd7-487c-87c0-9e3ca5b0cde2",
    "date": "2020-02-27T14:47:36.365+0000",
    "author": "king@test.com",
    "comment": "Hey",
    "topic_guid": "c84392ec-065f-4c89-aa2b-644486ca8e34",
    "viewpoint_guid": "c771d62e-0937-4164-b064-8c3b925ef70b",
    "authorization": {
      "comment_actions": ["update"]
    }
  }
]
```

Return all comments for a given topic.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/comments`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>includeAuthorization</td>
        <td>boolean</td>
        <td>whether to return the authorization object</td>
        <td>Mandatory</td>
    </tr>
</table>

### Response schema

List of [comment_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Comment/comment_GET.json)
