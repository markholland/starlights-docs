---
title: Create document reference
---

## Create document reference

> Example request

```http
POST https://api.catenda.com/opencde/bcf/3.0/projects/5af9e867-659d-4eee-ae56-2370aaf8aabe/topics/c84392ec-065f-4c89-aa2b-644486ca8e34/document_references
{
    "description": "new document reference",
    "document_guid": "ced73ed4-bd45-4eec-9779-9c3c619169c8"
}
```

> Example response

```json
{
  "guid": "45bb34da-8d03-41f6-a1fb-c707841a038f",
  "document_guid": "ced73ed4-bd45-4eec-9779-9c3c619169c8",
  "description": "new document reference"
}
```

Create the document reference between a topic and a document or url. Use either **document_guid** or **url**, not both.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/topics/{topic_guid}/document_references`

### Parameters

JSON encoded body using the "application/json" content type.

<table class="table">
    <tr><th>Name</th><th>Type</th><th>Description</th><th>Required</th></tr>
    <tr>
        <td>guid</td>
        <td>string</td>
        <td>the guid of the document reference</td>
        <td>Optional, if set: requires the guid not to exist in the project</td>
    </tr>
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

[document_reference_POST.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/DocumentReference/document_reference_POST.json)

### Response schema

[document_reference_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/DocumentReference/document_reference_GET.json)
