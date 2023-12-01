---
title: Get topic
---

## Get topic

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e/topics/ea7ca636-77e9-4e89-9188-aa5fe7f53036?includeAuthorization=true
```

> Example response

```json
{
  "guid": "ea7ca636-77e9-4e89-9188-aa5fe7f53036",
  "server_assigned_id": "2",
  "topic_type": "Error",
  "topic_status": "Open",
  "reference_links": [],
  "title": "Door issue",
  "labels": [],
  "creation_date": "2020-02-20T15:56:03.254+0000",
  "creation_author": "king@test.com",
  "modified_date": "2020-03-02T11:11:01.771+0000",
  "modified_author": "king@test.com",
  "assigned_to": "king@test.com",
  "description": "Door is misplaced",
  "authorization": {
    "topic_actions": [
      "createComment",
      "createViewpoint",
      "update",
      "delete",
      "updateRelatedTopics",
      "updateDocumentReferences"
    ],
    "topic_status": ["Open", "Closed"]
  },
  "bimsync_issue_number": 2,
  "bimsync_assigned_to": {
    "user": {
      "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
      "email": "king@test.com",
      "name": "King"
    },
    "team": {
      "ref": "fc9a1a7e2df143da887aeea27a90c400",
      "email": "team-h9TxeafTR6gWQXxF@bimsync.com",
      "name": "Chess mates"
    }
  },
  "bimsync_creation_author": {
    "user": {
      "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
      "email": "king@test.com",
      "name": "King Kong"
    },
    "importedBy": null
  }
}
```

Return the topic.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}`

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

### Select

> Example request with select

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e/topics?$select=creation_date,modified_date,assigned_to
```

> Example response with select

```json
[
  {
    "guid": "44405b7c-7bc1-4ea7-813b-e0ef156eb6db",
    "server_assigned_id": "12",
    "creation_date": "2020-03-03T08:06:39.264+0000",
    "modified_date": "2020-03-06T12:31:58.018+0000",
    "assigned_to": "king@test.com",
    "bimsync_issue_number": 12,
    "bimsync_assigned_to": {
      "user": {
        "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
        "email": "king@test.com",
        "name": "King"
      },
      "team": null
    },
    "bimsync_creation_author": {
      "user": {
        "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
        "email": "king@test.com",
        "name": "King Kong"
      },
      "importedBy": null
    },
    "bimsync_imported_at": "2020-03-03T11:10:46.986+0000"
  },
  {
    "guid": "c720fd87-75ad-4ba6-ac26-9296b4f6ff73",
    "server_assigned_id": "11",
    "creation_date": "2020-03-03T08:06:39.264+0000",
    "modified_date": "2020-03-03T08:06:39.264+0000",
    "assigned_to": "king@test.com",
    "bimsync_issue_number": 11,
    "bimsync_assigned_to": {
      "user": {
        "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
        "email": "king@test.com",
        "name": "King"
      },
      "team": null
    },
    "bimsync_creation_author": {
      "user": {
        "ref": null,
        "email": "queen@test.com",
        "name": null
      },
      "importedBy": {
        "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
        "email": "king@test.com",
        "name": "King"
      }
    },
    "bimsync_imported_at": "2020-03-03T11:10:23.158+0000"
  }
]
```

Use **$select** as a query parameter to choose which properties to include in the response. **guid**, **server_assigned_id** and **bimsync_issue_number** are always returned in addition.

<table class="table">
  <tr><th>Parameter</th><th>Returns</th></tr>
  <tr><td>*</td><td>all default fields</td></tr>
  <tr><td>title</td><td>title</td></tr>
  <tr><td>description</td><td>description</td></tr>
  <tr><td>index</td><td>index</td></tr>
  <tr><td>labels</td><td>labels</td></tr>
  <tr><td>due_date</td><td>due_date</td></tr>
  <tr><td>stage</td><td>stage</td></tr>
  <tr><td>creation_author</td><td>creation_author, bimsync_creation_author</td></tr>
  <tr><td>creation_date</td><td>creation_date, bimsync_imported_at</td></tr>
  <tr><td>modified_date</td><td>modified_date</td></tr>
  <tr><td>modified_author</td><td>modified_author</td></tr>
  <tr><td>assigned_to, bimsync_assigned_to</td><td>assigned_to, bimsync_assigned_to</td></tr>
  <tr><td>topic_status</td><td>topic_status</td></tr>
  <tr><td>topic_type</td><td>topic_type</td></tr>
  <tr><td>topic_priority</td><td>topic_priority</td></tr>
  <tr><td>reference_links</td><td>reference_links</td></tr>
  <tr><td>bim_snippet</td><td>bim_snippet</td></tr>
  <tr><td>bimsync_comments_size</td><td>bimsync_comments_size</td></tr>
  <tr><td>bimsync_requester</td><td>bimsync_requester</td></tr>
  <tr><td>bimsync_custom_fields</td><td>bimsync_custom_fields</td></tr>
  <tr><td>bimsync_points</td><td>bimsync_points</td></tr>
</table>

### Response schema

[topic_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Topic/topic_GET.json)
