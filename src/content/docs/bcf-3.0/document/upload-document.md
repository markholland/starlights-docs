---
title: Upload document
---

## Upload document

> Example request

```http
POST https://api.catenda.com/opencde/bcf/3.0/projects/3c34c9b3-1b9b-4750-a4f3-0641d58fe48e/documents
–header ‘Content-Disposition: attachment; filename="Myfile.xlxs"’

The document to upload
```

> Example response

```json
{
  "guid": "cfd79b46-a394-48a9-ba45-75fe3719e173",
  "filename": "Myfile.xlsx"
}
```

Upload the document.

### Resource URL

`https://api.catenda.com/opencde/bcf/{version_id}/projects/project_id/documents`

### Request body

The document to be uploaded.

### Response schema

[document_GET.json](https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas_draft-03/Collaboration/Document/document_GET.json)
