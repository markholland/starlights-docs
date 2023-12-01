---
title: Update topic
---

## Update topic

> Example request

```http
PUT https://api.catenda.com/opencde/bcf/3.0/projects/c0784b27-5057-43f6-bdb3-3607f4da86b0/topics/6411ce04-5391-40a6-97c2-be0ca45fcc96
{
    "topic_type": "Error",
    "topic_status": "Open",
    "title": "issue title",
    "labels": [
        "Arkitekt3"
    ],
    "creation_date": "2020-03-03T08:06:39.264+0000",
    "creation_author": "king@test.com",
    "bimsync_assigned_to": {
        "user": {
            "ref": "e4d94d45f7194f1f9f7b29ed994d01e4",
            "email": "king@test.com",
            "name": "King"
        },
        "team": null
    }
}
```

> Example response

```json
{
  "guid": "44405b7c-7bc1-4ea7-813b-e0ef156eb6db",
  "topic_type": "Error",
  "topic_status": "Open",
  "reference_links": [],
  "title": "issue title",
  "labels": ["Arkitekt3"],
  "creation_date": "2020-03-03T08:06:39.264+0000",
  "creation_author": "king@test.com",
  "modified_date": "2020-03-03T13:11:34.380+0000",
  "modified_author": "king@test.com",
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
}
```

Update the topic.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>    
    <tr>
        <td>topic_type</td>
        <td>string</td>
        <td>type of the topic (valid values from /projects/project_id/extensions.topic_type)</td>
        <td>Optional, default first type from /projects/project_id/extensions.topic_type</td>
    </tr>
    <tr>
        <td>topic_status</td>
        <td>string</td>
        <td>status of the topic (valid values from /projects/project_id/extensions.topic_status)</td>
        <td>Optional, default first open status from /projects/project_id/extensions.topic_status</td>
    </tr>
    <tr>
        <td>title</td>
        <td>string</td>
        <td>title of the topic</td>
        <td>Mandatory</td>
    </tr>
    <tr>
        <td>priority</td>
        <td>string</td>
        <td>the priority of the topic (valid values from /projects/project_id/extensions.priority)</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>index</td>
        <td>integer</td>
        <td>the index of the topic</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>labels</td>
        <td>list of string</td>
        <td>the labels applied to the topic (valid values from /projects/project_id/extensions.topic_label)</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>assigned_to</td>
        <td>string</td>
        <td>e-mail of the assigned user (valid values from /projects/project_id/extensions.user_id_type)</td>
        <td>Optional, default unassigned</td>
    </tr>
    <tr>
        <td>stage</td>
        <td>string</td>
        <td>the stage this topic is part of (valid values from /projects/project_id/extensions.stage)</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>description</td>
        <td>string</td>
        <td>description of the topic</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>bim_snippet</td>
        <td>object</td>
        <td>contains: snippet_type, is_external, reference and reference_schema</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>due_date</td>
        <td>string</td>
        <td>until when the issue needs to be resolved</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>bimsync_assigned_to</td>
        <td>object</td>
        <td>contains user and team</td>
        <td>Optional, overwrites assigned_to if set</td>
    </tr>
        <tr>
        <td>bimsync_assigned_to</td>
        <td>object</td>
        <td>contains user and team</td>
        <td>Optional, overwrites assigned_to if set</td>
    </tr>
    <tr>
        <td>bimsync_requester</td>
        <td>object</td>
        <td>contains user and team</td>
        <td>Optional</td>
    </tr>
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
    "bimsync_imported_at": "2020-03-03T11:10:46.986+0000"
  },
  {
    "guid": "c720fd87-75ad-4ba6-ac26-9296b4f6ff73",
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
    "bimsync_imported_at": "2020-03-03T11:10:23.158+0000"
  }
]
```

Use **$select** as a query parameter to choose which properties to include in the response. **guid** and **bimsync_issue_number** are always returned in addition.

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
  <tr><td>bimsync_custom_fields</td><td>bimsync_custom_fields</td></tr>
  <tr><td>bimsync_requester</td><td>bimsync_requester</td></tr>
</table>

### Request schema

[topic_PUT.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Topic/topic_PUT.json)

### Response schema

[topic_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Topic/topic_GET.json)
