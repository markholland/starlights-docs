---
title: Get document references
---

## Get document references

> Example request

```http
GET https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/document_references
```

> Example response

```json
[
  {
    "guid": "31f76de2-ee4d-4faf-bd84-53a20a34084d",
    "url": "https://hub.catenda.com",
    "description": "Best BIM platform"
  },
  {
    "guid": "5bb373ef-bdd1-4f0f-b3fc-58d91fe4e7ce",
    "document_guid": "a96a7491-82a4-4404-b1bd-4ba20b6d8692",
    "description": "myfile.txt"
  }
]
```

Return all document references for the specified topic. The **document_guid** from the response points to the guid of the document.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/document_references`

### Response schema

List of [document_reference_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/DocumentReference/document_reference_GET.json)
