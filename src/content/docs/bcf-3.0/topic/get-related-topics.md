---
title: Get related topics
---

## Get related topics

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/c0784b27-5057-43f6-bdb3-3607f4da86b0/topics/44405b7c-7bc1-4ea7-813b-e0ef156eb6db/related_topics
```

> Example response

```json
[
  {
    "related_topic_guid": "c720fd87-75ad-4ba6-ac26-9296b4f6ff73"
  },
  {
    "related_topic_guid": "19d10dec-44dc-41f1-b63c-c6cd91c6037d"
  }
]
```

Get all topics related or linked to this topic in the same issue board.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/related_topics`

### Response schema

List of [related_topic_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/RelatedTopic/related_topic_GET.json)

### Catenda extension

By adding the query parameter "?includeBimsyncProjectTopics=true", related topics in different issue boards will be included in the response.
The response entity will also include "bimsync_issue_board_ref" and "bimsync_issue_number"

> Example request:

```http
    GET https://api.catenda.com/opencde/bcf/3.0/projects/c0784b27-5057-43f6-bdb3-3607f4da86b0/topics/44405b7c-7bc1-4ea7-813b-e0ef156eb6db/related_topics?includeBimsyncProjectTopics=true
```

> Example response

```json
[
  {
    "related_topic_guid": "c720fd87-75ad-4ba6-ac26-9296b4f6ff73",
    "bimsync_issue_board_ref": "c0784b27-5057-43f6-bdb3-3607f4da86b0",
    "bimsync_issue_number": 1
  },
  {
    "related_topic_guid": "19d10dec-44dc-41f1-b63c-c6cd91c6037d",
    "bimsync_issue_board_ref": "c0784b27-5057-43f6-bdb3-3607f4da86b0",
    "bimsync_issue_number": 2
  },
  {
    "related_topic_guid": "68c091d8-586e-483e-b278-32e9f90dd1f7",
    "bimsync_issue_board_ref": "527a6b3a-5570-40ea-bc73-86c0bedd90e8",
    "bimsync_issue_number": 3
  }
]
```
