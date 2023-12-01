---
title: Update document reference
---

## Update document reference

> Example request

```http
PUT https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/document_references/31f76de2-ee4d-4faf-bd84-53a20a34084d
{
    "description": "Updated document reference",
    "document_guid": "1ff36294-1480-48f2-a3c4-a35be645d7ed"
}
```

> Example response

```json
{
  "guid": "31f76de2-ee4d-4faf-bd84-53a20a34084d",
  "document_guid": "1ff36294-1480-48f2-a3c4-a35be645d7ed",
  "description": "Updated document reference"
}
```

Edit a document reference. Use either **document_guid** or **url**, not both.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/document_references/{document_reference_guid}`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>document_guid</td>
        <td>string</td>
        <td>guid of the existing document</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>url</td>
        <td>string</td>
        <td>the referenced url</td>
        <td>Optional</td>
    </tr>
    <tr>
        <td>description</td>
        <td>string</td>
        <td>description the reference to create</td>
        <td>Optional</td>
    </tr>
</table>

### Request schema

[document_reference_PUT.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/DocumentReference/document_reference_PUT.json)

### Response schema

[document_reference_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/DocumentReference/document_reference_GET.json)
