---
title: CDE 2.0
---

# Catenda Rest API v2 Stable

<ul class="releases">
<li class="active"><a href="#">Stable</a></li>
<li><a href="/developers/reference/api/v2/beta">Beta</a></li>
<li><a href="/developers/reference/api/v2/dev">Development</a></li>
</ul>

# Deprecation notice

We are unifying all our APIs under one host, api.catenda.com. We'll be updating the docs in the coming days to reflect
the new URL mappings. Existing URLs pointing to https://api.bimsync.com or https://opencde.bimsync.com will continue to work
until the sunset date of **June 1st 2025**.

The old -> new mappings by API are as follows:

- https://api.bimsync.com/v2/... -> https://api.catenda.com/v2/...
- https://api.bimsync.com/js/... -> https://api.catenda.com/js/...
- https://api.bimsync.com/oauth/... -> https://api.catenda.com/oauth/...
- https://api.bimsync.com/oauth2/... -> https://api.catenda.com/oauth2/...
- https://opencde.bimsync.com/... -> https://api.catenda.com/opencde/...

# Introduction

Catenda REST API v2 is the latest supported version and in this documentation
we expose all the details on how to access these resources and what you can
expect as return values.

This documentation assumes a basic knowledge of how REST APIs work. Visit [this](https://www.restapitutorial.com/)
link if you need an introduction to this topic.

In case you have any questions or feedback, we would **love** to hear from you.
Email us at [support@catenda.com](mailto:support@catenda.com)

## Schema

All requests are over HTTPS from the address `https://api.catenda.com/v2`. Data
is sent and received as JSON, except for resources where files are uploaded or
download.

## Pagination

Resources that return multiple items are paginated. The default page size is
100 items and can be specified using the `pageSize` query parameter. Pages are
specified using the `page` query parameter. The `page` value for the first page
is 1.

| Name     | Type    | Description                                            |
| -------- | ------- | ------------------------------------------------------ |
| page     | Integer | Select a specific page. Default value is 1.            |
| pageSize | Integer | Select number of items per page. Default value is 100. |

Instead of calculating pagination queries yourself, you can find the
information in the `Link` header in paginated responses.

`Link: <https://api.catenda.com/v2/projects?page=2>; rel="next", <https://api.catenda.com/v2/projects?page=3> rel="last"`

The following values are used for `rel`:

| Name  | Description                                                                    |
| ----- | ------------------------------------------------------------------------------ |
| next  | Relation for the next page of items. Omitted if current page is the last.      |
| prev  | Relation for the previous page of items. Omitted if current page is the first. |
| first | Relation for the first page of items. Omitted if current page is the first.    |
| last  | Relation for the last page of items. Omitted if current page is the last.      |

The `X-total-count` header contains the total number of items

`X-total-count: 1204`

## Dates

All dates and times are returned in ISO 8601 format:

`YYYY-MM-DDTHH:MM:SSZ`

## Errors

Errors are returned as a JSON [Error](#error) object. The
reference for each resource have a detailed summary of all errors that
can occur.

### Common Errors

| Status                    | Code                    | Message                          |
| ------------------------- | ----------------------- | -------------------------------- |
| 401 Unauthorized          | 10 ACCESS_TOKEN_MISSING | Access token is missing          |
| 401 Unauthorized          | 11 ACCESS_TOKEN_INVALID | Access token is empty or invalid |
| 401 Unauthorized          | 12 ACCESS_TOKEN_EXPIRED | Access token has expired         |
| 500 Internal Server Error | 30 INTERNAL_ERROR       | Internal error                   |

# Authentication

## Authorization Code Grant

### 1. Obtain an authorization code

Redirect the user the URL `https://api.catenda.com/oauth2/authorize` with the
following query parameters set:

| Name          | Type   | Description                                                                                                                                                                               |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| client_id     | String | The `cliend_id` of the application doing the request.                                                                                                                                     |
| response_type | String | Value must be set to `code`.                                                                                                                                                              |
| response_mode | String | _Optional_ Value can be set to `query` or `fragment`                                                                                                                                      |
| state         | String | _Optional_ Any state which may be useful for you application. The state is returned by the response.                                                                                      |
| redirect_uri  | String | The URL where the response is sent. Must match the registered redirect URI of the application.                                                                                            |
| prompt        | String | _Optional_ If set to `none`, Catenda will remember the app so that the user only has to allow the app on first authorization. If set to `login`, Catenda will always show the login form. |

If the request is valid and the user authorizes your application Catenda will redirect back to
the redirect URI with the following query parameters:

| Name  | Type   | Description                          |
| ----- | ------ | ------------------------------------ |
| code  | String | The authorization code               |
| state | String | If supplied in authorization request |

If the request is valid and the user authorizes your application Catenda will redirect back to
the redirect URI with query parameter `error` set. Values are specified in [section 4.1.2.1 Error Response ](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)

### 2. Obtain an access token

> Example

```shell
curl -X POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=authorization_code&code=dlZE0KFxhM&redirect_uri=http%3A%2F%2Fclient%2eexample%2Ecom&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"
    "https://api.catenda.com/oauth2/token"
```

```json
{
    "access_token": "W2Lf11j7ZaVFxDc5CFCYJT",
    "refresh_token": "VQE9buKoozaw8Jtpp9t01W"
    "token_type": "bearer",
    "expires_in": 3599
}
```

After you have received the authorization code you can request an access token.

### Method

`POST`

### URL

`https://api.catenda.com/oauth2/token`

### Request format

`application/x-www-form-urlencoded`

### Request parameters

| Name          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| grant_type    | String | Value must be set to `authorization_code`                                   |
| code          | String | The authorization code                                                      |
| client_id     | String |
| client_secret | String |
| redirect_uri  | String | The URL where the response is sent. Must match the registered redirect URI. |

### Response format

`application/json`

### Response

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| access_token  | String  |
| refresh_token | String  |
| token_type    | String  |
| expires_in    | Integer |

### Errors

Specified in [section 5.2 Error Response ](https://tools.ietf.org/html/rfc6749#section-5.2)

### 3. Refreshing an access token

> Example

```shell
curl -X POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=refresh_token&refresh_token=IDR9ohXbbmnj8Wgcc9g01J&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"
    "https://api.catenda.com/oauth2/token"
```

```json
{
    "access_token": "W2Lf11j7ZaVFxDc5CFCYJT",
    "refresh_token": "VQE9buKoozaw8Jtpp9t01W"
    "token_type": "bearer",
    "expires_in": 3599
}
```

### Method

`POST`

### URL

`https://api.catenda.com/oauth2/token`

### Request format

`application/x-www-form-urlencoded`

### Request parameters

| Name          | Type   | Description                          |
| ------------- | ------ | ------------------------------------ |
| grant_type    | String | Value must be set to `refresh_token` |
| refresh_token | String |
| client_id     | String |
| client_secret | String |

### Response format

`application/json`

### Response

| Name          | Type    | Description |
| ------------- | ------- | ----------- |
| access_token  | String  |
| refresh_token | String  |
| token_type    | String  |
| expires_in    | Integer |

### Errors

Specified in [section 5.2 Error Response ](https://tools.ietf.org/html/rfc6749#section-5.2)

## PKCE

If you need to access the API from an application where the client secret can not be stored
secretly, like a desktop application or a mobile app, you should use PKCE.

PKCE works by having the app generate a random value at the beginning of the flow called a Code Verifier. The app hashes the Code Verifier and the result is called the Code Challenge.
The Code Challenge is sent in the authorization request and the Code Verifier is sent in the access token request. Now the Authorization Server can hash the Code Verifier and compare it to the Code Challenge. This is an effective, dynamic stand-in for a fixed client secret.

In order to enable PKCE, you can follow the Authorization Code Grant flow above, with the following changes:

### 1. Obtain an authorization code

In this step you need to provide the query parameter code_challenge.

### Request parameters

| Name           | Type   | Description                                                                                                                          |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| code_challenge | String | The code challenge is created by SHA256 hashing the code_verifier. Base64UrlEncode(SHA256Hash(ASCII((code_verifier))). See RFC 7636. |

### 2. Obtain an access token

In this step you must NOT send the client secret.
Instead, you need to provide the query parameter `code_verifier`.

Note that the redirect url must have a defined scheme in the uri, like: `http://`, `https://` or `app://`.
The domain can be either `localhost`, `127.0.0.1` or a scheme that has `app://` as a substring, like `myapp://`.
Example of valid redirect urls: `http://localhost`, `https://127.0.0.1`, `myapp://mydomain.com`.

### Request parameters

| Name          | Type   | Description                                                                                                                             |
| ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| code_verifier | String | A high-entropy cryptographic random string with a minimum length of 43 characters and a maximum length of 128 characters. See RFC 7636. |

## Client Credentials Grant

> Example

```shell
curl -X POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"
    "https://api.catenda.com/oauth2/token"
```

```json
{
  "access_token": "dJ3nS4CmaWLm95noO8Lfku",
  "token_type": "bearer",
  "expires_in": 3599
}
```

<aside class="info"><strong>Client Credentials Grant is only available to <a href="https://catenda.com/products/bimsync-boost">Catenda Boost customers</a>.</strong></aside>

### Method

`POST`

### URL

`https://api.catenda.com/oauth2/token`

### Request format

`application/x-www-form-urlencoded`

### Request parameters

| Name          | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| grant_type    | String | Value must be set to `client_credentials` |
| client_id     | String |
| client_secret | String |

### Response format

`application/json`

### Response

| Name         | Type    | Description |
| ------------ | ------- | ----------- |
| access_token | String  |
| token_type   | String  |
| expires_in   | Integer |

### Errors

Specified in [section 5.2 Error Response ](https://tools.ietf.org/html/rfc6749#section-5.2)

# Objects

This describes the objects that are returned from the core resources of the API. Objects returned from IFC resources are specified in the [IFC](#ifc) section.

## Error

### Description

Represents an error.

### Fields

| Name    | Type    | Description |
| ------- | ------- | ----------- |
| code    | Integer |
| message | String  |

### Error codes

| Code | Name                         | Description |
| ---- | ---------------------------- | ----------- |
| 10   | ACCESS_TOKEN_MISSING         |
| 11   | ACCESS_TOKEN_INVALID         |
| 12   | ACCESS_TOKEN_EXPIRED         |
| 20   | NOT_FOUND                    |
| 21   | FORBIDDEN                    |
| 22   | UNPROCESSABLE_ENTITY         |
| 23   | EMPTY_FILE                   |
| 24   | BAD_REQUEST                  |
| 30   | INTERNAL_ERROR               |
| 100  | INSUFFICIENT_PRIVILEGE       |
| 101  | PROJECT_LIMIT_EXCEEDED       |
| 102  | INVALID_VIEWER_TOKEN         |
| 103  |  INSUFFICIENT_AUTHENTICATION |
| 200  | INVALID_IFC                  |

## User

> Example

```json
{
    "avatarUrl": "https://api.catenda.com/v2/avatar/8R0qply0O2NzNNQspd2Lnriwt1wF0LwJsjW"
    "createdAt": "2016-09-20T14:32:25Z",
    "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
    "name": "Kristine Knight",
    "username": "kristine.knight@example.com"
}
```

```json
{
    "avatarUrl": "https://api.catenda.com/v2/avatar/Q28zNNQRsp3d2L45nri799aDq7K3YW"
    "createdAt": "2016-09-20T14:55:22Z",
    "id": "524809076a694255b989d236517a55da",
    "name": "Clean Cut Builders",
    "username": null
}
```

### Description

Represents a User, Organization or Team.

A _User_ is someone with a Catenda account, commonly representing a person.

An _Organization_ represents a company, project organization or an application. Organizations do not have a username and cannot sign in to Catenda.

A _Team_ represents a group of users within a project. Teams do not have a username and cannot sign in to Catenda.

### Fields

| Name      | Type           | Description                                                                                                                                                                                                                                                                               |
| --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avatarUrl | String         | The URL for the users avatar.                                                                                                                                                                                                                                                             |
| createdAt | [Date](#dates) | The date and time the user was created.                                                                                                                                                                                                                                                   |
| id        | String         | A unique identifier for a user. Represented as compacted UUID using 32 hexadecimal characters.                                                                                                                                                                                            |
| name      | String         | The name of the user. Limited to 128 characters.                                                                                                                                                                                                                                          |
| username  | String         | The handle the user identifies with. If the User represents an organization or a team the value is always **null**. Commonly the username will be in email address format. Usernames are unique but subject to change. Use _id_ as an identifier when possible. Limited to 50 characters. |

## Member

> Example

```json
{
    "role": "owner",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/8R0qply0O2NzNNQspd2Lnriwt1wF0LwJsjW"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com",
        "avatarUrl": "https://api.catenda.com/v2/avatar/12345676543345654"
    }
}
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q28zNNQRsp3d2L45nri799aDq7K3YW"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "573761199e2147dcae4a7a0661e03a26",
        "name": "Ron Ramirez",
        "username": "ron.ramirez@example.com",
        "avatarUrl": "https://api.catenda.com/v2/avatar/7876571245424"
    }
}
```

### Description

Represents project, organization and team memberships. A user can be member of many projects, organizations and teams, and have different roles for each membership:

_owner_ is used for project and organization memberships. A project must contain a single member with the _owner_ role. An owner has full control of its projects and organization.

_administrator_ is used to delegate most _owner_ privilege to other members of project. Only the _owner_ can delete a project or change _owner_.

_member_ is used for regular members in projects, organization and teams.

### Fields

| Name | Type          | Description                               |
| ---- | ------------- | ----------------------------------------- |
| role | String        | 'owner', 'administrator' or 'member'      |
| user | [User](#user) | The [User](#user) representing the member |

## Project

> Example

```json
{
  "createdAt": "2016-09-26T14:45:05Z",
  "description": "Cutting edge contemporary apartments",
  "id": "af2d8af0fa54465b89bf26dd3d92cfd0",
  "imageUrl": "https://api.catenda.com/v2/projects/c729538c4f674d729fd42236793e6a12/image",
  "name": "Primavera Tower",
  "owner": {
    "avatarUrl": "https://api.catenda.com/v2/avatar/QCLn9TjCsmB72igTOaA39sBg6Y6qQDHHwm9ajjJFOf8wJBcnsa0iwt1wF0LwJsjW",
    "id": "68022af80842431291e31ad8c52e8ee6",
    "name": "John Doe",
    "username": "john.doe@sample.org"
  },
  "siteLocation": {
    "longitude": 8.26,
    "latitude": 6.46422
  },
  "updatedAt": "2016-09-26T14:45:40Z"
}
```

### Description

All data in Catenda belongs to a project. A project can contain models, issues and libraries and has a single owner.

### Fields

| Name         | Type                                                                    | Description                                                                                         |
| ------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| createdAt    | [Date](#dates)                                                          | The date and time the project was created.                                                          |
| description  | String                                                                  | A short text describing the project. Limited to 1024 characters.                                    |
| id           | String                                                                  | A unique identifier for the project. Represented as compacted UUID using 32 hexadecimal characters. |
| imageUrl     | String                                                                  | The URL for the project cover picture.                                                              |
| name         | String                                                                  | The name of the project. Limited to 512 characters.                                                 |
| owner        | [User](#user)                                                           | The [User](#user) that owns the project.                                                            |
| siteLocation | The approximate location (latitude, longitude in WGS84) of the project. |
| updatedAt    | [Date](#dates)                                                          | The date and time of the last change in the project.                                                |

## Model

> Example

```json
{
  "id": "67024671cbd642a9b7c84808b4d509f5",
  "name": "ARCH"
}
```

### Description

Represents an IFC model as a set of [Revisions](#revision). A large building project can contain multiple IFC models. They are often divided by domain (architecture, electrical, etc.)

### Fields

| Name | Type   | Description                                                                                     |
| ---- | ------ | ----------------------------------------------------------------------------------------------- |
| id   | String | A unique identifier for a model. Represented as compacted UUID using 32 hexadecimal characters. |
| name | String | The name of the project. Limited to 512 characters.                                             |

## Revision

> Example

```json
{
    "comment": "Initial revision",
    "createdAt": "2016-09-26T14:45:20Z",
    "id": "25fd3cebaf5d443991d3644cc4d8aa4f",
    "model": {
        "id": "67024671cbd642a9b7c84808b4d509f5",
        "name": "ARCH"
    },
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q28zNNQRsp3d2L45nri799aDq7K3YW"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "version": 1
}
```

### Description

Represents a revision of a [Model](#model). A new revision is created by uploading an IFC model.

### Fields

| Name      | Type            | Description                                                                                          |
| --------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| comment   | String          | A short text describing the revision. Limited to 64K characters.                                     |
| createdAt | [Date](#dates)  | The date and time the revision was created.                                                          |
| id        | String          | A unique identifier for the revision. Represented as compacted UUID using 32 hexadecimal characters. |
| model     | [Model](#model) | The model the revision belongs to.                                                                   |
| user      | [User](#user)   | The [User](#user) that created the revision.                                                         |
| version   | Integer         | A number that is incremented for each new revision of a model.                                       |

## RevisionStatus

> Example

```json
{
    "callbackUri": "https://example.com",
    "filename": "ARK.ifc",
    "id": "acbb72736862483f89d77890d47ec119",
    "model": {
        "id": "67024671cbd642a9b7c84808b4d509f5",
        "name": "ARCH"
    },
    "processing": {
        "error": null,
        "progress": 0.0,
        "status": "waiting"
    },
    "revision": null,
    "size": 7483193,
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q28zNNQRsp3d2L45nri799aDq7K3YW"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    }
}
```

### Description

Represents the status of a pending revision.

### Fields

| Name        | Type                                  | Description                                                                                        |
| ----------- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| callbackUri | String                                | The callback URI specified when uploading the revision.                                            |
| filename    | String                                | The filename specified when uploading the revision.                                                |
| id          | String                                | A unique identifier for the status. Represented as compacted UUID using 32 hexadecimal characters. |
| model       | [Model](#model)                       | The model the revision will belong to.                                                             |
| processing  | [ProcessingStatus](#processingstatus) | The revision processing status.                                                                    |
| revision    | [Revision](#revision)                 | The newly create revision. Will be null if processing status is _FAILURE_.                         |
| user        | [User](#user)                         | The [User](#user) that is creating the revision.                                                   |

## ProcessingStatus

> Example

```json
{
  "error": null,
  "progress": 0.0,
  "status": "waiting"
}
```

```json
{
  "error": null,
  "progress": 1.0,
  "status": "success"
}
```

### Description

Represents the processing status of a pending revision.

### Fields

| Name     | Type            | Description                                             |
| -------- | --------------- | ------------------------------------------------------- |
| progress | Number          | Processing progress as a number between 0.0 and 1.0 .   |
| status   | String          | Either 'waiting', 'processing', 'success' or 'failure'. |
| error    | [Error](#error) | An error if status is 'failure'.                        |

## Label

### Description

Represents a single label.

### Fields

| Name  | Type       | Description                                                                                                             |
| ----- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| id    | String     | A unique identifier for a label. Represented as compacted UUID using 32 hexadecimal characters.                         |
| name  | String     | The name of the label.                                                                                                  |
| color | String     | The hex color of the label.                                                                                             |
| group | LabelGroup |  (Only included if the query parameter include="group") The group of the label, null if the label does not have a group |

## LabelGroup

### Description

Represents a single label group.

### Fields

| Name | Type   | Description                                                                                           |
| ---- | ------ | ----------------------------------------------------------------------------------------------------- |
| id   | String | A unique identifier for a label group. Represented as compacted UUID using 32 hexadecimal characters. |
| name | String | The name of the label group.                                                                          |

## Library

_Note: The [Libraries](#libraries) section is currently being implemented. This object is incomplete._

### Description

A library represents an object collection containing either documents, links, and [bSDD](http://bsdd.buildingsmart.org) classifications.

Each object in the collection is a [LibraryItem](#libraryitem). Items can be associated to IFC products.

### Fields

| Name | Type   | Description                                                                                       |
| ---- | ------ | ------------------------------------------------------------------------------------------------- |
| id   | String | A unique identifier for a library. Represented as compacted UUID using 32 hexadecimal characters. |
| name | String | The name of the library. Limited to 256 characters.                                               |

## LibraryItem

_Note: The [Libraries](#libraries) section is currently being implemented. This object is incomplete._

### Description

Represents a single item in a library. Examples of items are documents, links, and [bSDD](http://bsdd.buildingsmart.org) classifications.

### Fields

| Name     | Type   | Description                                                                                                                                                               |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id       | String | A unique identifier for a library item. Represented as compacted UUID using 32 hexadecimal characters.                                                                    |
| name     | String | The name of the library item.                                                                                                                                             |
| parentId | String | A unique identifier for the parent of the library item. Represented as compacted UUID using 32 hexadecimal characters. If no parent is present, the value is set to null. |
| document | Object |  Contains attributes for the library items of type document.                                                                                                              |

## LibraryItemAssociation

_Note: The [Libraries](#libraries) section is currently being implemented. This object is incomplete._

### Description

Represents an association between a library item and an IFC product.

### Fields

| Name      | Type           | Description                                                                                                                                    |
| --------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| createdAt | [Date](#dates) | The date and time the association was created. This field is not set for the embedded value library.                                           |
| globalId  | String         | A 22 character [IfcGloballyUniqueId](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcgloballyuniqueid.htm) |
| user      | [User](#user)  | The [User](#user) that created the association. This field is not set for the embedded value library.                                          |

## DocumentDownloadToken

### Description

Represents a time limited access token to grant access to a document. A token is valid for one hour.

### Fields

| Name  | Type   | Description                                       |
| ----- | ------ | ------------------------------------------------- |
| token | String | The token value. The token is valid for one hour. |
| url   | String | A time limited URL to download the document.      |

## ViewerToken

### Description

Represents a time limited access token to grant access to viewer data. A token is valid for one hour.

### Fields

| Name      | Type                           | Description                                                                                                                                                                                                              |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| revisions | Array of [Revision](#revision) | The set of revisions the token grants access to.                                                                                                                                                                         |
| token     | String                         | The token value. The token is valid for one hour.                                                                                                                                                                        |
| url       | String                         | URL used to load models in [Catenda Viewer3D loadUrl](https://api.catenda.com/developers/reference/viewer-3d/1.0#loadurl) or [Catenda Viewer2D loadUrl](https://api.catenda.com/developers/reference/viewer-2d#loadurl). |

## Webhook

### Events

> Example event

```json
{
  "event": {
    "id": "a7dc5c3c63944c218222fe9627e2a06e",
    "type": "issue.status.changed",
    "timestamp": 1638353917124
  },
  "project": {
    "id": "44f86598653845bb897485a364c47ebb",
    "name": "Lillestrøm Trade Fair",
    "description": "New section D4",
    "createdAt": "2021-05-03T11:57:59Z",
    "updatedAt": "2021-12-01T11:18:12Z"
  },
  "issue": {
    "id": "cbe17e31e2884bc094d333d743766248",
    "url": "https://bimsync.com/project/44f86598653845bb897485a364c47ebb/issues/8",
    "boardId": "f25fa72a4807475fad4964852bdc49af",
    "title": "Replace front door",
    "description": "Replace with higher fire rating",
    "statusId": "42cc2e276b684510b6b8a62ddf40df04",
    "status": "Open",
    "typeId": "474590c8a05b4da191dc0b5474a9835a",
    "type": "Task",
    "assignedTo": {
      "id": "e4d94d45f7194f1f9f7b29ed994d01e4",
      "name": "Kristine Knight",
      "username": "kristine.knight@example.com",
      "email": "kristine.knight@example.com",
      "createdAt": "2020-02-12T13:03:50Z",
      "type": "user"
    }
  },
  "changedBy": {
    "id": "e4d94d45f7194f1f9f7b29ed994d01e4",
    "name": "Kristine Knight",
    "username": "kristine.knight@example.com",
    "email": "kristine.knight@example.com",
    "createdAt": "2020-02-12T13:03:50Z",
    "type": "user"
  }
}
```

Supported webhook events.

| Name                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| issue.created                       | A new issue has been created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| issue.modified                      |  An issue has been modified. We try to follow the [BCF events](https://github.com/buildingSMART/BCF-API) as long as the events exists in BCF. Supported events are comment_created, viewpoint_created, status_updated, type_updated, priority_updated, assigned_to_removed, assigned_to_updated, due_date_updated, due_date_removed, title_updated, description_updated, labels_added and labels_removed. You can also get webhooks for specific modifications like issue.status.changed, see below. |
| issue.deleted                       | An issue has been deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| issue.status.changed                | The status of the issue has changed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| library.document.revision.published | A new revision of a document has been published.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| model.created                       | A new model is created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| revision.created                    | A new revision is uploaded and has been processed.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Subscription

A _Webhook subscription_ is a subscription for a callback on a given URL for a given event in Catenda.

> Example subscription

```json
{
  "id": "47d5457e09d64380af75ea94ed96557d",
  "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
  "createdAt": "2019-02-13T14:15:18Z",
  "state": "ENABLED",
  "failureCount": 0,
  "event": "model.created"
}
```

### Fields

| Name         | Type           | Description                                                                                                                               |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| id           | String         | A unique identifier for a Webhook. Represented as compacted UUID using 32 hexadecimal characters.                                         |
| target_url   | String         | The URL to be called when the event occur.                                                                                                |
| createdAt    | [Date](#dates) | The date and time the Webhook was created.                                                                                                |
| state        | String         | The state of the Webhook. Valid values are 'ENABLED', 'DISABLED_GONE', 'DISABLED_TOO_MANY_FAILURES' or 'DISABLED_BY_USER'.                |
| failureCount | Number         | The number of times the Webhook has failed.                                                                                               |
| event        | String         | An event which triggers a callback to the specified URL. Valid values are 'model.created', 'revision.created' and 'issue.status.changed'. |

# Users

## Get current user

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/user"
```

```json
{
  "createdAt": "2016-09-20T14:32:25Z",
  "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
  "name": "Kristine Knight",
  "username": "kristine.knight@example.com",
  "avatarUrl": "https://api.catenda.com/v2/avatar/123456789ABCDEF"
}
```

### Description

Get the current [User](#user).

### Method

`GET`

### URL

`https://api.catenda.com/v2/user`

### Response format

`application/json`

### Response

Returns the current [User](#user).

## Update current user

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"Kristine Knight\" }" \
    "https://api.catenda.com/v2/user"
```

```json
{
  "createdAt": "2016-09-20T14:32:25Z",
  "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
  "name": "Kristine Knight",
  "username": "kristine.knight@example.com",
  "avatarUrl": "https://api.catenda.com/v2/avatar/123456789ABCDEF"
}
```

### Description

Update the current [User](#user).

### Method

`PUT`

### URL

`https://api.catenda.com/v2/user`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                                  |
| ---- | ------ | -------------------------------------------- |
| name | String | Name of the user. Limited to 128 characters. |

### Response format

`application/json`

### Response

Returns the updated [User](#user).

## List starred projects for current user

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    "https://api.catenda.com/v2/user/starred_projects"
```

```json
[{
    "id": "25bab8c94d62403d818b28ad742efc3a"
    "name": "Great project"
    "owner": {id: "92857fa71234586cadf9caf28be49fde", name: "project owner", username: null, createdAt: "2018-04-26T10:29:38Z", "avatarUrl": "https://api.catenda.com/v2/avatar/1234567899876543"}
    "createdAt": "2020-01-22T12:31:38Z"
    "updatedAt": "2020-01-30T12:11:55Z"
    "siteLocation": {longitude: null, latitude: null}
    "imageUrl": "https://api.catenda.com/v2/projects/25bab8c94d62403d818b28ad742efc3a/image"
},
...
]
```

### Description

List all projects the current user has picked as 'starred project'.

### Method

`GET`

### URL

`https://api.catenda.com/v2/user/starred_projects`

### Response format

`application/json`

### Response

Returns an array of [Project](#project).

## List users

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/users"
```

```json
[
  {
    "createdAt": "2016-09-20T14:32:25Z",
    "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
    "name": "Kristine Knight",
    "username": "kristine.knight@example.com",
    "avatarUrl": "https://api.catenda.com/v2/avatar/123456789ABCDEF"
  },
  {
    "createdAt": "2016-09-20T14:32:25Z",
    "id": "573761199e2147dcae4a7a0661e03a26",
    "name": "Ron Ramirez",
    "username": "ron.ramirez@example.com",
    "avatarUrl": "https://api.catenda.com/v2/avatar/876543234567"
  },
  {
    "createdAt": "2016-09-20T14:32:25Z",
    "id": "0afa76cf0d3442a982482d93000a49de",
    "name": "Chris Cavazos",
    "username": "chris.cavazos@example.com",
    "avatarUrl": "https://api.catenda.com/v2/avatar/5335686423467"
  },
  {
    "createdAt": "2016-09-20T14:32:25Z",
    "id": "bcd7bcbc8b4144de855b66280845640b",
    "name": "Chester Cohen",
    "username": "chester.cohen@example.com",
    "avatarUrl": "https://api.catenda.com/v2/avatar/1234321237654"
  }
]
```

<aside class="warning"><strong>This resource is only available to integration partners.</strong></aside>

### Description

List all users managed by the current client. Access token must be
generated using the client credential grant type.

### Method

`GET`

### URL

`https://api.catenda.com/v2/users`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| username | String | _Optional_. Filter by username. |

### Response format

`application/json`

### Response

Returns an array of [User](#user).

### Errors

| Status        | Code         | Message |
| ------------- | ------------ | ------- |
| 403 Forbidden | 21 FORBIDDEN |

## Get user

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/users/bcd7bcbc8b4144de855b66280845640b"
```

```json
{
  "createdAt": "2016-09-20T14:32:25Z",
  "id": "bcd7bcbc8b4144de855b66280845640b",
  "name": "Chester Cohen",
  "username": "chester.cohen@example.com",
  "avatarUrl": "https://api.catenda.com/v2/avatar/46765438765456"
}
```

<aside class="warning"><strong>This resource is only available to integration partners.</strong></aside>

### Description

Get a single user. The user must be managed by the current client. Access token must be generated using the client credential grant type.

### Method

`GET`

### URL

`https://api.catenda.com/v2/users/:user`

### Response format

`application/json`

### Response

Returns a [User](#user).

### Errors

| Status        | Code         | Message                |
| ------------- | ------------ | ---------------------- |
| 403 Forbidden | 21 FORBIDDEN |
| 404 Not Found | 20 NOT_FOUND | User (:user) not found |

## Create user

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"name\": \"Kristine Knight\" \
           \"username\": \"kristine.knight@example.com\" }" \
    "https://api.catenda.com/v2/users"
```

```json
{
  "createdAt": "2016-09-20T14:32:25Z",
  "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
  "name": "Kristine Knight",
  "username": "kristine.knight@example.com"
}
```

<aside class="warning"><strong>This resource is only available to integration partners.</strong></aside>

### Description

Create a new user that will be managed by the current client.
Access token must be generated using the client credential grant type.

### Method

`POST`

### URL

`https://api.catenda.com/v2/users`

### Request format

`application/json`

### Request parameters

| Name     | Type   | Description                                                |
| -------- | ------ | ---------------------------------------------------------- |
| name     | String | Name of the user. Limited to 128 characters.               |
| username | String | A unique handle in email format. Limited to 50 characters. |

### Response format

`application/json`

### Response

Returns the created [User](#user).

### Errors

| Status                   | Code                    | Message                         |
| ------------------------ | ----------------------- | ------------------------------- |
| 403 Forbidden            | 21 FORBIDDEN            |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY | _Message from input validation_ |

## Delete user

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/users/bcd7bcbc8b4144de855b66280845640b"
```

```http
Status: 204 No Content
```

<aside class="warning"><strong>This resource is only available to integration partners.</strong></aside>

### Description

Delete a user. The user must be managed by the current client.
Access token must be generated using the client credential grant type.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/users`

### Response

_No content_

### Errors

| Status        | Code         | Message                |
| ------------- | ------------ | ---------------------- |
| 403 Forbidden | 21 FORBIDDEN |
| 404 Not Found | 20 NOT_FOUND | User (:user) not found |

# Organizations

## List organizations

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/orgs"
```

```json
[
  {
    "createdAt": "2016-09-20T14:55:22Z",
    "id": "524809076a694255b989d236517a55da",
    "name": "Clean Cut Builders",
    "username": null
  }
]
```

### Description

List all organizations the current user is a member of.

### Method

`GET`

### URL

`https://api.catenda.com/v2/orgs`

### Response format

`application/json`

### Response

Returns an array of organization [User](#user).

## Get organization

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da"
```

```json
{
  "createdAt": "2016-09-20T14:55:22Z",
  "id": "524809076a694255b989d236517a55da",
  "name": "Clean Cut Builders",
  "username": null
}
```

### Description

Get a single organization. The current user must be member of the organization.

### Method

`GET`

### URL

`https://api.catenda.com/v2/orgs/:org`

### Response format

`application/json`

### Response

Returns an organization [User](#user).

### Errors

| Status        | Code         | Message                       |
| ------------- | ------------ | ----------------------------- |
| 404 Not Found | 20 NOT_FOUND | Organization (:org) not found |

## Update organization

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"Clean Cut Builders\" }" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da"
```

```json
{
  "createdAt": "2016-09-20T14:55:22Z",
  "id": "524809076a694255b989d236517a55da",
  "name": "Clean Cut Builders",
  "username": null
}
```

### Description

Update an organization. The current user must be an owner of
the organization.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/orgs/:org`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                                         |
| ---- | ------ | --------------------------------------------------- |
| name | String | Name of the organization. Limited to 128 characters |

### Response format

`application/json`

### Response

Returns the updated organization [User](#user).

### Errors

| Status                   | Code                       | Message                         |
| ------------------------ | -------------------------- | ------------------------------- |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege          |
| 404 Not Found            | 20 NOT_FOUND               | Organization (:org) not found   |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_ |

## List organization members

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/members"
```

```json
[
    {
        "role": "owner",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q28zNNQRsp3d2L45nri799aDq7K3YW"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Ann-Marie Hoag",
            "username": "ann.marie.hoag@example.com"
        }
    },
    {
        "role": "member",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/RRy39sDf002JHsi9g2JW"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "573761199e2147dcae4a7a0661e03a26",
            "name": "Ron Ramirez",
            "username": "ron.ramirez@example.com"
        }
    },
    {
        "role": "member",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "0afa76cf0d3442a982482d93000a49de",
            "name": "Chris Cavazos",
            "username": "chris.cavazos@example.com"
        }
    },
    {
        "role": "member",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/2IjRew92jeGZe2l54BEr"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "bcd7bcbc8b4144de855b66280845640b",
            "name": "Chester Cohen",
            "username": "chester.cohen@example.com"
        }
    }
]
```

### Description

List organization members. The current user must be member of
the organization.

### Method

`GET`

### URL

`https://api.catenda.com/v2/orgs/:org/members`

### Response format

`application/json`

### Response

Returns an array of [Member](#member).

### Errors

| Status        | Code         | Message                       |
| ------------- | ------------ | ----------------------------- |
| 404 Not Found | 20 NOT_FOUND | Organization (:org) not found |

## Get organization member

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/members/bcd7bcbc8b4144de855b66280845640b"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "bcd7bcbc8b4144de855b66280845640b",
        "name": "Chester Cohen",
        "username": "chester.cohen@example.com"
    }
}
```

### Description

Get organization member. The current user must be member of the organization.

### Method

`GET`

### URL

`https://api.catenda.com/v2/orgs/:org/members/:user`

### Response format

`application/json`

### Response

Returns a [Member](#member).

### Errors

| Status        | Code         | Message                       |
| ------------- | ------------ | ----------------------------- |
| 404 Not Found | 20 NOT_FOUND | Organization (:org) not found |
| 404 Not Found | 20 NOT_FOUND | Member (:user) not found      |

## Update organization member

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"role\": \"owner\" }" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/members/bcd7bcbc8b4144de855b66280845640b"
```

```json
{
    "role": "owner",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "bcd7bcbc8b4144de855b66280845640b",
        "name": "Chester Cohen",
        "username": "chester.cohen@example.com"
    }
}
```

### Description

Update an organization membership. The current user must be an
owner of the organization.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/orgs/:org/members/:user`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description         |
| ---- | ------ | ------------------- |
| role | String | _owner_ or _member_ |

### Response format

`application/json`

### Response

Returns the updated [Member](#member).

### Errors

| Status                   | Code                       | Message                             |
| ------------------------ | -------------------------- | ----------------------------------- |
| 400 Bad Request          | 24 BAD_REQUEST             | Invalid role (:role)                |
| 400 Bad Request          | 24 BAD_REQUEST             | Unable to remove last owner (:user) |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 404 Not Found            | 20 NOT_FOUND               | Organization (:org) not found       |
| 404 Not Found            | 20 NOT_FOUND               | Member (:user) not found            |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_     |

## Add organization member

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"user\": \"bcd7bcbc8b4144de855b66280845640b\" \
           \"role\": \"member\" }" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/members"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "bcd7bcbc8b4144de855b66280845640b",
        "name": "Chester Cohen",
        "username": "chester.cohen@example.com"
    }
}
```

### Description

Add an organization member. The current user must be an owner
of the organization.

### Method

`POST`

### URL

`https://api.catenda.com/v2/orgs/:org/members`

### Response format

`application/json`

### Response

Returns the created [Member](#member).

### Errors

| Status                   | Code                       | Message                          |
| ------------------------ | -------------------------- | -------------------------------- |
| 400 Bad Request          | 24 BAD_REQUEST             | Unknown user (:user)             |
| 400 Bad Request          | 24 BAD_REQUEST             | User (:user) is already a member |
| 400 Bad Request          | 24 BAD_REQUEST             | Invalid role (:role)             |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege           |
| 404 Not Found            | 20 NOT_FOUND               | Organization (:org) not found    |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_  |

## Remove organization member

> Example

```http
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/members/bcd7bcbc8b4144de855b66280845640b"
```

```
Status: 204 No Content
```

### Description

Remove an organization member. The current user must be an
owner of the organization to remove other members.

There must be at least one other owner in the organization
when removing the current user.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/orgs/:org/members/:user`

### Response format

`application/json`

### Response

_No content_

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to remove last owner (:user) |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 404 Not Found   | 20 NOT_FOUND               | Organization (:org) not found       |
| 404 Not Found   | 20 NOT_FOUND               | Member (:user) not found            |

# Projects

## List projects

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects"
```

```json
[
  {
    "createdAt": "2016-09-23T14:40:29Z",
    "description": "Old Town, Stavanger",
    "id": "989038325613499ea6d35a3d8788b3a9",
    "imageUrl": "https://api.catenda.com/v2/projects/c729438c4f674d729fd42236783e6a12/image",
    "name": "Old Town High School",
    "owner": {
      "avatarUrl": "https://api.catenda.com/v2/avatar/QCLn9TjCsmB72igTOaA39sBg6Y6qQDHHwm9ajjJFOf8wJBcnsa0iwt1wF0LwJsjW",
      "id": "68022af80842431291e31ad8c52e8ee6",
      "name": "John Doe",
      "username": "john.doe@sample.org"
    },
    "siteLocation": {
      "longitude": 1.23456,
      "latitude": 3.466422
    },
    "updatedAt": "2016-09-23T14:41:57Z"
  },
  {
    "createdAt": "2016-09-26T14:45:05Z",
    "description": "Cutting edge contemporary apartments",
    "id": "af2d8af0fa54465b89bf26dd3d92cfd0",
    "imageUrl": "https://api.catenda.com/v2/projects/c729538c4f674d729fd42236793e6a12/image",
    "name": "Primavera Tower",
    "owner": {
      "avatarUrl": "https://api.catenda.com/v2/avatar/QCLn9TjCsmB72igTOaA39sBg6Y6qQDHHwm9ajjJFOf8wJBcnsa0iwt1wF0LwJsjW",
      "id": "68022af80842431291e31ad8c52e8ee6",
      "name": "John Doe",
      "username": "john.doe@sample.org"
    },
    "siteLocation": {
      "longitude": 8.26,
      "latitude": 6.46422
    },
    "updatedAt": "2016-09-26T14:45:40Z"
  }
]
```

### Description

List all projects the current user is member of.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects`

### Response format

`application/json`

### Response

Returns an array of [Project](#project).

## Get project

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0"
```

```json
{
  "createdAt": "2016-09-26T14:45:05Z",
  "description": "Cutting edge contemporary apartments",
  "id": "af2d8af0fa54465b89bf26dd3d92cfd0",
  "imageUrl": "https://api.catenda.com/v2/projects/c729538c4f674d729fd42236793e6a12/image",
  "name": "Primavera Tower",
  "owner": {
    "avatarUrl": "https://api.catenda.com/v2/avatar/QCLn9TjCsmB72igTOaA39sBg6Y6qQDHHwm9ajjJFOf8wJBcnsa0iwt1wF0LwJsjW",
    "id": "68022af80842431291e31ad8c52e8ee6",
    "name": "John Doe",
    "username": "john.doe@sample.org"
  },
  "siteLocation": {
    "longitude": 8.26,
    "latitude": 6.46422
  },
  "updatedAt": "2016-09-26T14:45:40Z"
}
```

### Description

Get a project. The current user must be a member of the project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project`

### Response format

`application/json`

### Response

Returns a [Project](#project).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Update project

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"name\": \"Primavera Tower\",
           \"description\": \"Cutting edge contemporary apartments\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0"
```

```json
{
  "createdAt": "2016-09-26T14:45:05Z",
  "description": "Cutting edge contemporary apartments",
  "id": "af2d8af0fa54465b89bf26dd3d92cfd0",
  "imageUrl": "https://api.catenda.com/v2/projects/c729538c4f674d729fd42236793e6a12/image",
  "name": "Primavera Tower",
  "owner": {
    "avatarUrl": "https://api.catenda.com/v2/avatar/QCLn9TjCsmB72igTOaA39sBg6Y6qQDHHwm9ajjJFOf8wJBcnsa0iwt1wF0LwJsjW",
    "id": "68022af80842431291e31ad8c52e8ee6",
    "name": "John Doe",
    "username": "john.doe@sample.org"
  },
  "siteLocation": {
    "longitude": 8.26,
    "latitude": 6.46422
  },
  "updatedAt": "2016-09-26T14:45:40Z"
}
```

### Description

Update a project. The current user must be an administrator of
the project.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/projects/:project`

### Request format

`application/json`

### Request parameters

| Name        | Type   | Description                                                      |
| ----------- | ------ | ---------------------------------------------------------------- |
| description | String | A short text describing the project. Limited to 1024 characters. |
| name        | String | The name of the project. Limited to 512 characters.              |

### Response format

`application/json`

### Response

Returns the updated [Project](#project).

### Errors

| Status                   | Code                       | Message                         |
| ------------------------ | -------------------------- | ------------------------------- |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege          |
| 404 Not Found            | 20 NOT_FOUND               | Project (:project) not found    |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_ |

## Create project

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"name\": \"Primavera Tower\",
           \"description\": \"Cutting edge contemporary apartments\" }" \
    "https://api.catenda.com/v2/projects"
```

```json
{
  "createdAt": "2016-09-26T14:45:05Z",
  "description": "Cutting edge contemporary apartments",
  "id": "af2d8af0fa54465b89bf26dd3d92cfd0",
  "name": "Primavera Tower",
  "updatedAt": "2016-09-26T14:45:40Z"
}
```

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"name\": \"Old Town High School\",
           \"description\": \"Old Town, Stavanger\" }" \
    "https://api.catenda.com/v2/orgs/524809076a694255b989d236517a55da/projects"
```

```json
{
  "createdAt": "2016-09-23T14:40:29Z",
  "description": "Old Town, Stavanger",
  "id": "989038325613499ea6d35a3d8788b3a9",
  "name": "Old Town High School",
  "updatedAt": "2016-09-23T14:41:57Z"
}
```

### Description

Create a new project. The project will be owned by the current user or
the given origanization and count towards the owners project limit.

The current user must be an owner of the organization if the new project will be owned by an organization.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects`
`https://api.catenda.com/v2/orgs/:org/projects`

### Request format

`application/json`

### Request parameters

| Name        | Type                                                             | Description                                         |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| description | A short text describing the project. Limited to 1024 characters. |
| name        | String                                                           | The name of the project. Limited to 512 characters. |

### Response format

`application/json`

### Response

Returns created [Project](#project).

### Errors

| Status                   | Code                       | Message                         |
| ------------------------ | -------------------------- | ------------------------------- |
| 403 Forbidden            | 101 PROJECT_LIMIT_EXCEEDED | Project limit exceeded          |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege          |
| 404 Not Found            | 20 NOT_FOUND               | Organization (:org) not found   |
| 422 Unprocessable entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_ |

## Delete project

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0"
```

```http
Status: 204 No Content
```

### Description

Delete a project. The current user must be the owner of the
project. If the project is owned by an organization, the user must an owner of the organization.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project`

### Response

_No content_

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |

# Members

## List members

> Example

```shell
curl -X GET \"
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/members"
```

```json
[
    {
        "role": "owner",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        }
    },
    {
        "role": "member",
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/r31Jf8LKkeZ744Gsf"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "573761199e2147dcae4a7a0661e03a26",
            "name": "Robin Chapel",
            "username": "robin.chapel@example.com"
        }
    }
]
```

### Description

List project members.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/members`

### Query parameters

| Name     | Type   | Description                                                                         |
| -------- | ------ | ----------------------------------------------------------------------------------- |
| userType | String | _Optional_. Filter by userType. Accepts the values 'user', 'team' or 'organization' |

### Response format

`application/json`

### Response

Returns an array of [Member](#member).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Get member

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/members/b8dd966cb6d844d3bbaa2705d9e7d980"
```

```json
{
    "role": "owner",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    }
}
```

### Description

Get a project member.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/members/:user`

### Response format

`application/json`

### Response

Returns a [Member](#member)

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Member (:user) not found     |

## Add member

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"user\": \"573761199e2147dcae4a7a0661e03a26\",
           \"role\": \"member\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/members"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "573761199e2147dcae4a7a0661e03a26",
        "name": "Robin Chapel",
        "username": "robin.chapel@example.com"
    }
}
```

### Description

Add a project member. The current user must be an administrator of the project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/members`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                             |
| ---- | ------ | --------------------------------------- |
| user | String | The [User](#user) id for the new member |
| role | String | 'administrator' or 'member'             |

### Response format

`application/json`

### Response

Returns the created [Member](#member).

### Errors

| Status          | Code                       | Message                                         |
| --------------- | -------------------------- | ----------------------------------------------- |
| 400 Bad Request | 24 BAD_REQUEST             | User (:user) is already a member                |
| 400 Bad Request | 24 BAD_REQUEST             | Unknown user (:user)                            |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to set role (:role)                      |
| 400 Bad Request | 24 BAD_REQUEST             | Cannot add an existing team as a member (:user) |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid role (:role)                            |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                          |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found                    |

## Remove member

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/members/573761199e2147dcae4a7a0661e03a26"
```

```http
Status: 204 No Content
```

### Description

Remove a project member. The current user must be a project
administrator. The project owner cannot be removed from the project.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/members/:user`

### Response

_No content_

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to remove last owner (:user) |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Member (:user) not found            |

## Update member

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"role\": \"administrator\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/members/573761199e2147dcae4a7a0661e03a26"
```

```json
{
    "role": "administrator",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "573761199e2147dcae4a7a0661e03a26",
        "name": "Robin Chapel",
        "username": "robin.chapel@example.com"
    }
}
```

### Description

Update project membership. The current user must be a project
administrator.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/projects/:project/members/:user`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| role | String | 'administrator' or 'member' |

### Response format

`application/json`

### Response

Returns the upated [Member](#member).

### Errors

| Status          | Code                       | Message                          |
| --------------- | -------------------------- | -------------------------------- |
| 400 Bad Request | 24 BAD_REQUEST             | User (:user) is already a member |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to set role (:role)       |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid role (:role)             |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege           |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found     |
| 404 Not Found   | 20 NOT_FOUND               | Member (:user) not found         |

## Get team

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/c9dd966cb6d844d3bbaa2705d9e7d980"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/C2g778jIuQy40X4jaqF7"
        "createdAt": "2018-09-20T14:32:25Z",
        "id": "c9dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Architects",
        "type": "team"
    }
}
```

### Description

Get a project team. Identical to `Get member`, but will only return teams.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team`

### Response format

`application/json`

### Response

Returns a [Member](#member)

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Team (:team) not found       |

## Add team

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"name\": \"Painters\",
           \"role\": \"member\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": null
        "createdAt": "2019-09-20T14:32:25Z",
        "id": "224761199e2147dcae4a7a0661e03a26",
        "name": "Painters",
        "type": "team"
    }
}
```

### Description

Add a project team. The current user must be an administrator of the project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/teams`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| name | String | The name of the team        |
| role | String | 'administrator' or 'member' |

### Response format

`application/json`

### Response

Returns the created [Member](#member).

### Errors

| Status          | Code                       | Message                      |
| --------------- | -------------------------- | ---------------------------- |
| 403 Forbidden   | 21 FORBIDDEN               | Team exists                  |
| 400 Bad Request | 24 BAD_REQUEST             | The name was empty           |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to set role (:role)   |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid role (:role)         |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found |

## Remove team

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26"
```

```http
Status: 204 No Content
```

### Description

Remove a project team. The current user must be a project
administrator.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team`

### Response

_No content_

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Team (:team) not found       |

## Update team role

> Example

```shell
curl -X PATCH \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"role\": \"administrator\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26"
```

```json
{
    "role": "administrator",
    "user": {
        "avatarUrl": null
        "createdAt": "2019-09-20T14:32:25Z",
        "id": "224761199e2147dcae4a7a0661e03a26",
        "name": "Painters",
        "type": "team"
    }
}
```

### Description

Update project membership for the team. The current user must be a project
administrator. Note! The members of the team will receive updated roles.

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                 |
| ---- | ------ | --------------------------- |
| role | String | 'administrator' or 'member' |

### Response format

`application/json`

### Response

Returns the updated [Member](#member).

### Errors

| Status          | Code                       | Message                      |
| --------------- | -------------------------- | ---------------------------- |
| 400 Bad Request | 24 BAD_REQUEST             | Unable to set role (:role)   |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid role (:role)         |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND               | Team (:team) not found       |

## Update team name

> Example

```shell
curl -X PATCH \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"Designers\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26"
```

```json
{
    "role": "member",
    "user": {
        "avatarUrl": null
        "createdAt": "2019-09-20T14:32:25Z",
        "id": "224761199e2147dcae4a7a0661e03a26",
        "name": "Designers",
        "type": "team"
    }
}
```

### Description

Update the name of the team. The current user must be a project
administrator.

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description              |
| ---- | ------ | ------------------------ |
| name | String | The new name of the team |

### Response format

`application/json`

### Response

Returns the updated [Member](#member).

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 21 FORBIDDEN               | Team exists                  |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Team (:team) not found       |

## Add team member

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"user\": \"2r4761199e2147dcae4a7a0661e03a26\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26/members"
```

### Description

Adds a user to the team. The current user must be a project
administrator.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team/members`

### Request parameters

| Name | Type   | Description                               |
| ---- | ------ | ----------------------------------------- |
| user | String | the user that should be added to the team |

### Response format

`application/json`

### Response

Returns the added [Member](#member).

### Errors

| Status          | Code                       | Message                                  |
| --------------- | -------------------------- | ---------------------------------------- |
| 400 Bad Request | 24 BAD REQUEST             | The user is already a member of the team |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                   |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found             |
| 404 Not Found   | 20 NOT_FOUND               | User (:user) not found                   |
| 404 Not Found   | 20 NOT_FOUND               | Team (:team) not found                   |

## Remove team member

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26/members/2r4761199e2147dcae4a7a0661e03a26"
```

### Description

Removes a user from the team. The current user must be a project
administrator.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team/members/:user`

### Errors

| Status          | Code                       | Message                              |
| --------------- | -------------------------- | ------------------------------------ |
| 400 Bad Request | 24 BAD REQUEST             | The user is not a member of the team |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege               |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found         |
| 404 Not Found   | 20 NOT_FOUND               | User (:user) not found               |
| 404 Not Found   | 20 NOT_FOUND               | Team (:team) not found               |

## List team members

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/teams/224761199e2147dcae4a7a0661e03a26/members"
```

### Description

Lists the members of a team.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/teams/:team/members`

### Response format

`application/json`

### Response

Returns the members [Member](#member).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Team (:team) not found       |

# Models & Revisions

## Models & Revisions Overview

Catenda is a platform designed to share and collaborate on digital building models (BIM). Catenda uses the [Industry Foundation Classes (IFC)](http://www.buildingsmart-tech.org/) data model to represents BIM data. IFC is an open standard that provides a high level of interoperability and allow users to exchange data created in different tools.

A building and construction project will most likely have contributors from different domains. It is benefitial to let each design team manage its own BIM, but also a requirement to be able to view the project as a whole. In Catenda, a project can consist of multiple models. The project contributors can decide what models are needed. The models can be visualized individually or combined in Catenda Viewer3D and Viewer2D. The model data can be accessed as an aggregated project using the [IFC resources](#ifc) in the API.

Related resources:

- [Create model](#create-model)
- [Delete model](#delete-model)

Sharing the BIM as the design progresses is of great benefit when designing a building. Looking back at a previous version of a model is useful. Catenda solves this by allowing users to upload each version of a model as a separate revision. Each revision is immutable - its content will never change. Older revisions can always be accessed.

Related resources:

- [Create revision](#create-revision)
- [Download model](#download-model)
- [Download revision](#download-revision)

### IFC Support

Catenda supports IFC release [IFC2x3](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/index.htm) and accepts models in the following formats: IFC-SPF (.ifc), IFC-XML (.ifcXML) and IFC-ZIP (.ifcZIP). IFC files must be syntactically correct but the data population of a model is not formally validated against the IFC schema.

Models can be downloaded in IFC-SPF (.ifc) format.

### IFC Processing

When an IFC file is uploaded to Catenda it must be processed for the content to be available in the platform. IFC files are often large and contain data that is computationally expensive to process.

IFC processing consists of the following steps:

1. **Validation**. The IFC file is parsed and the structure of the data is validated. Catenda will not perform a formal validation of the data against the IFC schema (e.g. WHERE rules in EXPRESS are not enforced).
2. **Create revision**. Each entity in the IFC file is assigned a unique ID and the new revision is added to the model.
3. **Process contents**. The revision content is processed to generate datasets for Catenda Viewer2D and Viewer3D. It is indexed to expose the data in the [IFC resources](#ifc).

An API client can pass a URI when uploading a new IFC file to get notified when processing is complete.

## List models

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models"
```

```json
[
  {
    "id": "67024671cbd642a9b7c84808b4d509f5",
    "name": "ARCH"
  },
  {
    "id": "635acc6129d440848a40eef82c52f6ae",
    "name": "ELEC"
  },
  {
    "id": "f9b1402d0f9f481484551e422138f8a2",
    "name": "STRUCT"
  }
]
```

### Description

List all models in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/models`

### Response format

`application/json`

### Response

Returns an array of [Model](#model).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Get model

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models/67024671cbd642a9b7c84808b4d509f5"
```

```json
{
  "id": "67024671cbd642a9b7c84808b4d509f5",
  "name": "ARCH"
}
```

### Description

Get a model.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/models/:model`

### Response format

`application/json`

### Response

Returns a [Model](#model).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Model (:model) not found     |

## Download model

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/ifc" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models/67024671cbd642a9b7c84808b4d509f5?normalize=true
```

```
ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]','Option [Filter: VisibleElements]'),'2;1');
FILE_NAME('M:\\2010\\400-449\\10-409 Bimmy\\10-409 IFC\\ARK\\ARK_Asplund.ifc','2010-10-27T21:32:24',('Architect'),('Building Designer Office'),'PreProc - EDM 5.0','ArchiCAD 13.00 Release 1. Windows Build Number of the Ifc 2x3 interface: 64125 (21-07-2009)\X\0A','The authorising person');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;

DATA;
#1= IFCORGANIZATION('GS','Graphisoft','Graphisoft',$,$);
#2= IFCAPPLICATION(#49650001,'13.0','ArchiCAD 13.0','ArchiCAD');
...
```

### Description

Download the latest revision of a model as IFC.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/models/:model`

### Query parameters

| Name      | Type    | Description                                                                                                               |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| normalize | Boolean | _Optional_. If set to **true** the STEP instance names will start at #1, otherwise they will equal its Catenda object ID. |

### Response format

`application/ifc`

### Response

IFC

### Errors

| Status        | Code         | Message                         |
| ------------- | ------------ | ------------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found    |
| 404 Not Found | 20 NOT_FOUND | Model (:model) not found        |
| 404 Not Found | 20 NOT_FOUND | Model (:model) has no revisions |

## Update model

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"ARCH\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models/67024671cbd642a9b7c84808b4d509f5"
```

```json
{
  "id": "67024671cbd642a9b7c84808b4d509f5",
  "name": "ARCH"
}
```

### Description

Update a model. The current user must be an administrator of the
project.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/projects/:project/models/:model`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                                   |
| ---- | ------ | --------------------------------------------- |
| name | String | Name of the model. Limited to 512 characters. |

### Response format

`application/json`

### Response

Returns the updated [Model](#model).

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Model (:model) not found     |

## Create model

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"ARCH\" } \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models"
```

```json
{
  "id": "67024671cbd642a9b7c84808b4d509f5",
  "name": "ARCH"
}
```

### Description

Create a new model.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/models`

### Request format

`application/json`

### Request parameters

| Name | Type   | Description                                   |
| ---- | ------ | --------------------------------------------- |
| name | String | Name of the model. Limited to 512 characters. |

### Response format

`application/json`

### Response

Returns the created [Model](#model).

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |

## Delete model

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/models/67024671cbd642a9b7c84808b4d509f5"
```

```http
Status: 204 No Content
```

### Description

Delete a model. The current user must be an administrator of
the project.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/models/:model`

### Response

_No content_

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Model (:model) not found     |

## List revisions

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/revisions"
```

```json
[
    {
        "comment": "Initial revision",
        "createdAt": "2016-09-26T14:45:20Z",
        "id": "25fd3cebaf5d443991d3644cc4d8aa4f",
        "model": {
            "id": "67024671cbd642a9b7c84808b4d509f5",
            "name": "ARCH"
        },
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        },
        "version": 1
    },
    {
        "comment": "Initial revision",
        "createdAt": "2016-09-26T14:45:40Z",
        "id": "3dfce8f494ba45e685f3494e89365446",
        "model": {
            "id": "f9b1402d0f9f481484551e422138f8a2",
            "name": "STRUCT"
        },
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        },
        "version": 1
    }
]
```

### Description

List all revisions in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/revisions`

### Query parameters

| Name    | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| model   | String | _Optional_. Filter by model.                          |
| product | Long   | _Optional_. Filter by the objectID of an IFC product. |

### Response format

`application/json`

### Response

Returns an array of [Revision](#revision).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Model (:model) not found     |
| 404 Not Found | 20 NOT_FOUND | Product (:product) not found |

## Get revision

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/revisions/25fd3cebaf5d443991d3644cc4d8aa4f"
```

```json
{
    "comment": "Initial revision",
    "createdAt": "2016-09-26T14:45:20Z",
    "id": "25fd3cebaf5d443991d3644cc4d8aa4f",
    "model": {
        "id": "67024671cbd642a9b7c84808b4d509f5",
        "name": "ARCH"
    },
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "version": 1
}
```

### Description

Get a revision.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/revisions/:revision`

### Response format

`application/json`

### Response

Returns a [Revision](#revision).

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Download revision

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/ifc" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/revisions/25fd3cebaf5d443991d3644cc4d8aa4f"
```

```
ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]','Option [Filter: VisibleElements]'),'2;1');
FILE_NAME('C:\\example.ifc','2010-10-27T21:32:24',('Architect'),('Building Designer Office'),'PreProc - EDM 5.0','ArchiCAD 13.00 Release 1. Windows Build Number of the Ifc 2x3 interface: 64125 (21-07-2009)\X\0A','The authorising person');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;

DATA;
#49650001= IFCORGANIZATION('GS','Graphisoft','Graphisoft',$,$);
#49650002= IFCAPPLICATION(#49650001,'13.0','ArchiCAD 13.0','ArchiCAD');
...
```

### Description

Download a revision as IFC.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/revisions/:revision`

### Query parameters

| Name      | Type    | Description                                                                                                                       |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| normalize | Boolean | _Optional_. If set to **true** the STEP instance names will start at #1, otherwise they will be equal to their Catenda object ID. |

### Response format

`application/ifc`

### Response

IFC

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Create revision

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/ifc" \
    --header "Bimsync-Params: { \"callbackUri"\: \"https://example.com\", \
                                \"comment\": \"Add windows\", \
                                \"filename\": \"ARCH.ifc\", \
                                \"model\": \"67024671cbd642a9b7c84808b4d509f5\" } " \
    --data-binary @ARCH.ifc \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/revisions"
```

```json
{
    "callbackUri": "https://example.com",
    "filename": "ARK.ifc",
    "id": "acbb72736862483f89d77890d47ec119",
    "model": {
        "id": "67024671cbd642a9b7c84808b4d509f5",
        "name": "ARCH"
    },
    "processing": {
        "error": null,
        "progress": 0.0,
        "status": "waiting"
    },
    "revision": null,
    "size": 7483193,
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    }
}
```

### Description

Create a new revision.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/revisions`

### Request format

`application/ifc`

### Request body

Request body is the content of an IFC file.

### Request parameters

Request parameters are passed as JSON in the HTTP header `Bimsync-Params`.

| Name        | Type   | Description                                                                                                                                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| callbackUri | String | _Optional_. Pass a URI to be notified when the revision is processed. Catenda will issue an HTTP GET request with the query parameter _token_ set to revision status ID and _result_ set to either 'success' or 'error'. |
| comment     | String | A short text describing the revision. Limited to 64K characters.                                                                                                                                                         |
| filename    | String | The original name of the IFC file. The name is used in format detection and should have the extension .ifc, .ifcZIP or .ifcXML.                                                                                          |
| model       | String | ID of the model the revision should be added to.                                                                                                                                                                         |

### Response format

`application/json`

### Response

Returns the initial [RevisionStatus](#revisionstatus).

### Errors

| Status          | Code                       | Message                      |
| --------------- | -------------------------- | ---------------------------- |
| 400 Bad Request | 23 EMPTY_FILE              | Empty file uploaded          |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND               | Model (:model) not found     |

## Get revision status

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/revision_status/a7615441a5964b01a6e22b4872c4e87a"
```

```json
{
    "callbackUri": null,
    "filename": "RIB.ifc",
    "id": "a7615441a5964b01a6e22b4872c4e87a",
    "model": {
        "id": "f9b1402d0f9f481484551e422138f8a2",
        "name": "STRUCT"
    },
    "processing": {
        "error": null,
        "progress": 1.0,
        "status": "success"
    },
    "revision": {
        "comment": "Initial revision",
        "createdAt": "2016-09-26T14:45:40Z",
        "id": "3dfce8f494ba45e685f3494e89365446",
        "model": {
            "id": "f9b1402d0f9f481484551e422138f8a2",
            "name": "STRUCT"
        },
        "user": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        },
        "version": 1
    },
    "size": 458745,
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    }
}
```

### Description

Get the status of a pending revision.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/revision_status/:revision_status`

### Response format

`application/json`

### Response

Returns a [RevisionStatus](#revisionstatus).

### Errors

| Status        | Code         | Message                                      |
| ------------- | ------------ | -------------------------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found                 |
| 404 Not Found | 20 NOT_FOUND | Revision status (:revision_status) not found |

# Labels

## List labels

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/labels?include=group"
```

```json
[
  {
    "id": "7c7a1753a5a64b9180432ec1bfdba5e1",
    "name": "Green",
    "color": "#6aa84f",
    "group": {
      "id": "3823274e07194278bd812347a0197164",
      "name": "Colors"
    }
  },
  {
    "id": "ad2924cfbb614e379bbe78915676b488",
    "name": "Yellow",
    "color": "#ffe599",
    "group": {
      "id": "3823274e07194278bd812347a0197164",
      "name": "Colors"
    }
  },
  {
    "id": "0cd4e09cc140430f80139383b7f83ffd",
    "name": "Important",
    "color": "#cccccc",
    "group": null
  }
]
```

### Description

List all labels.

### Method

`GET`

### Query parameters

| Name    | Type    | Description                                                                                                                               |
| ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| include |  String |  Optional. Comma separated list of referenced properties that will be added to the result items. Possible values: 'group'.                |
| search  |  String | Optional search text. Will filter the result to only contain items matching the search.                                                   |
| id      | String  | Optional. Comma separated list of label unque identifiers. Will filter the result to only contain items with the ids matching this field. |

### URL

`https://api.catenda.com/v2/projects/:project/labels`

### Response format

`application/json`

### Response

Returns an array of [Label](#label).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Create label

> Example

```shell
curl -X POST \
--header "Authorization: Bearer $ACCESS_TOKEN" \
--header "Content-Type: application/json" \
--data-raw '{
    "name": "My label",
    "color": "#ffffff"
}' \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels'

```

### Description

Creates a new label.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/labels`

### Query parameters

| Name    | Type    | Description                                                                                                                |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| include |  String |  Optional. Comma separated list of referenced properties that will be added to the result items. Possible values: 'group'. |

### Request parameters

| Name         | Type    | Description                                                                      |
| ------------ | ------- | -------------------------------------------------------------------------------- |
| name         |  String | The name of the label.                                                           |
| color        |  String | The color of the label. Should be an hexadecimal color value. Example: `#ffffff` |
| labelGroupId | String  | Optional. The label group identifier to which you wish to assign the new label.  |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns a [Label](#label).

### Errors

| Status                   | Code                       | Message                                 |
| ------------------------ | -------------------------- | --------------------------------------- |
| 404 Not Found            | 20 NOT_FOUND               | Project (:project) not found            |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                  |
| 403 Forbidden            | 21 Forbidden               | Label with the same name already exists |
| 400 Bad Request          | 24 BAD_REQUEST             | Invalid label color                     |
| 404 Not found            | 20 BAD_REQUEST             | Label group not found                   |
| 422 Unprocessable Entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_         |

## Get Label

> Example

```shell

curl -X GET --header "Authorization: Bearer $ACCESS_TOKEN" \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/3570817bdf324114889195bd5de3235a'

```

### Description

Get a label.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/labels/:label`

### Query parameters

| Name    | Type    | Description                                                                                                                |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| include |  String |  Optional. Comma separated list of referenced properties that will be added to the result items. Possible values: 'group'. |

### Response format

`application/json`

### Response

Returns a [Label](#label).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Label (:label) not found     |

## Update Label

> Example

```shell
curl -X PATCH \
--header "Authorization: Bearer $ACCESS_TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "My label updated",
    "color": "#ccccce"
}' \
 'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/3570817bdf324114889195bd5de3235a'
```

### Description

Update an existing label

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/labels/:label`

### Query parameters

| Name    | Type    | Description                                                                                                                |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| include |  String |  Optional. Comma separated list of referenced properties that will be added to the result items. Possible values: 'group'. |

### Request parameters

| Name         | Type    | Description                                                                                                           |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------- |
| name         |  String | The name of the label. This is the new name for the label.                                                            |
| color        | String  | The color of the label. This is the new color for the label. Should be an hexadecimal color value. Example: `#ffffff` |
| labelGroupId | String  | The label group where the label will belong. Pass null to remove the label from its current group.                    |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the updated [Label](#label).

### Errors

| Status                   | Code                       | Message                                 |
| ------------------------ | -------------------------- | --------------------------------------- |
| 404 Not Found            | 20 NOT_FOUND               | Project (:project) not found            |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                  |
| 403 Forbidden            | 21 Forbidden               | Label with the same name already exists |
| 400 Bad Request          | 24 BAD_REQUEST             | Invalid label color                     |
| 404 Not found            | 20 BAD_REQUEST             | Label group not found                   |
| 422 Unprocessable Entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_         |

## Delete label

> Example

```shell
curl -X DELETE --header "Authorization: Bearer $ACCESS_TOKEN" \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/3570817bdf324114889195bd5de3235a'
```

### Response

Returns 204 No content

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Label (:label) not found     |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |

## List label groups

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/labels/label-groups"
```

### Description

List all labels.

### Method

`GET`

### Query parameters

| Name   | Type    | Description                                                                                                                               |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| search |  String | Optional search text. Will filter the result to only contain items matching the search.                                                   |
| id     | String  | Optional. Comma separated list of label unque identifiers. Will filter the result to only contain items with the ids matching this field. |

### URL

`https://api.catenda.com/v2/projects/:project/labels/label-groups`

### Response format

`application/json`

### Response

Returns an array of [Label groups](#labelgroup).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Create label group

> Example

```shell
curl -X POST \
--header "Authorization: Bearer Bearer $ACCESS_TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "My group"
}' \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/label-groups'
```

### Description

Create a label group.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/labels/label-groups`

### Request parameters

| Name | Type    | Description                  |
| ---- | ------- | ---------------------------- |
| name |  String | The name of the label group. |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the created [Label group](#labelgroup).

### Errors

| Status                   | Code                       | Message                                       |
| ------------------------ | -------------------------- | --------------------------------------------- |
| 404 Not Found            | 20 NOT_FOUND               | Project (:project) not found                  |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                        |
| 403 Forbidden            | 21 FORBIDDEN               | Label group with the same name already exists |
| 422 Unprocessable Entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_               |

## Get label group

> Example

```shell
curl -X GET \
--header "Authorization: Bearer Bearer $ACCESS_TOKEN" \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/label-groups/ec7a7a017a11447eab318ffee7eba690'
```

### Description

Get a label group.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/labels/label-groups/:group`

### Response format

`application/json`

### Response

Returns a [Label group](#labelgroup).

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Label group (:group) not found |

## Update Label group

> Example

```shell
curl -X PATCH  \
--header "Authorization: $ACCESS_TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
   "name": "My group updated"
}' \
'https://api.catenda.com//v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/label-groups/ec7a7a017a11447eab318ffee7eba690'
```

### Description

Update an existing label group

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/labels/label-groups/:group`

### Request parameters

| Name | Type    | Description                                                            |
| ---- | ------- | ---------------------------------------------------------------------- |
| name |  String | The name of the label group. This is the new name for the label group. |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the updated [label Group](#labelgroup).

### Errors

| Status                   | Code                       | Message                                       |
| ------------------------ | -------------------------- | --------------------------------------------- |
| 404 Not Found            | 20 NOT_FOUND               | Project (:project) not found                  |
| 403 Forbidden            | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                        |
| 404 Not found            | 20 BAD_REQUEST             | Label group not found                         |
| 403 Forbidden            | 21 Forbidden               | Label group with the same name already exists |
| 422 Unprocessable Entity | 22 UNPROCESSABLE_ENTITY    | _Message from input validation_               |

## Delete label group

> Example

```shell
curl -X DELETE \
--header "Authorization: $ACCESS_TOKEN" \
'https://api.catenda.com/v2/projects/17e790580f714ae39fe03df5dd07c24b/labels/label-groups/523088435fcc47b8bc823a1dbfe7ce90'
```

### Response

Returns 204 No content

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 403 Forbidden | 21 FORBIDDEN               | Label group in use           |

# Libraries

_Note: The Libraries section is currently being implemented. The resources and objects are incomplete._

## List libraries

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries"
```

```json
[
  {
    "id": "e3007e60dc8211e5b26e22000ad1b98b",
    "name": "bSDD"
  },
  {
    "id": "e3052233dc8211e5b26e22000ad1b98b",
    "name": "Links"
  },
  {
    "id": "e321d95edc8211e5b26e22000ad1b98b",
    "name": "Documents"
  }
]
```

### Description

List all libraries in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries`

### Response format

`application/json`

### Response

Returns an array of [Library](#library).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Create library

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"windows\", \"type\": \"classification\", \"classification\": { \"edition\": \"3A\" } }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries"
```

### Description

Create a library. This resource is currently supported for classification libraries.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries`

### Request parameters

| Name           | Type    | Description                                           |
| -------------- | ------- | ----------------------------------------------------- |
| name           |  String | The name of the library.                              |
| type           |  String |  The library type. Valid values are 'classification'. |
| classification |  Object | Fields specific for classification libraries.         |

Classification object:

| Name        | Type    | Description                                                                                                         |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| source      |  String |  *Optional*. Source (or publisher) for this classification.                                                         |
| edition     |  String |  *Optional*. The edition or version of the classification system from which the classification notation is derived. |
| editionDate |  String | _Optional_. The date on which the edition of the classification used became valid. The format should be yyyy-mm-dd. |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the created library.

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |
| 400 Bad Request | 24 BAD_REQUEST             | The (:field) field is required      |
| 400 Bad Request | 24 BAD_REQUEST             | Unknown library type (:type)        |
| 409 Conflict    | 25 CONFLICT                | Library already exists              |

## Get library

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b"
```

```json
{
  "id": "e321d95edc8211e5b26e22000ad1b98b",
  "name": "Documents"
}
```

### Description

Get a library.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library`

### Response format

`application/json`

### Response

Returns a [Library](#library).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Library (:library) not found |

## Update library

> Example

```shell
curl -X PATCH \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"new-name\"} }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b"
```

### Description

Update a library. Currently we support updating the name of the library.

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library`

### Request parameters

| Name | Type    | Description                                                    |
| ---- | ------- | -------------------------------------------------------------- |
| name |  String | The name of the library. This is the new name for the library. |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the updated library.

### Errors

| Status          | Code                       | Message                      |
| --------------- | -------------------------- | ---------------------------- |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported                |
| 400 Bad Request | 24 BAD_REQUEST             | Library name is required     |

## Delete library

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b"
```

```json
{
  "id": "ea41cfb2d93e4203962ffc7b63dca666",
  "name": "NS 3451",
  "type": "classification"
}
```

### Description

Delete a library.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library`

### Response format

`application/json`

### Response

Returns a [Library](#library).

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found        |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |

## List library items

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items?include=labels"
```

```json
[
  {
    "id": "22e20a0171d0483b94980799e8fdf9fd",
    "name": "example.txt",
    "parentId": null,
    "labels": [
      {
        "id": "f9809ff6993c49248f22641ab5139d5c",
        "name": "Blue",
        "color": "#3c78d8"
      },
      {
        "id": "0cd4e09cc140430f80139383b7f83ffd",
        "name": "Important",
        "color": "#cccccc"
      }
    ],
    "document": {
      "type": "file",
      "createdAt": "2017-12-07T13:05:14Z",
      "owner": "b13a2df1072e47339038ddf2de231231",
      "revision": {
        "id": "30132dd4d07a445b81cb527cc6bc813b",
        "version": 1,
        "name": "the-uploaded-file-name.txt",
        "createdAt": "2017-12-07T13:05:14Z",
        "size": 69541,
        "createdBy": {
          "id": "b13a2df1072e47339038ddf2de231231",
          "name": "Kristine Knight",
          "username": "kristine.knight@example.com",
          "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        },
        "additionalFormats": []
      }
    }
  },
  {
    "id": "a002411fa6454b6facb70bd225dc03bf",
    "name": "example.pdf",
    "parentId": "e01b197c889846c89ffc26fcb58a939a",
    "labels": [],
    "document": {
      "type": "file",
      "createdAt": "2017-11-07T13:03:24Z",
      "owner": "b13a2df1072e47339038ddf2de231231",
      "revision": {
        "id": "30132dd4d07a445b81cb527cc6bc813b",
        "version": 2,
        "name": "the-uploaded-file-name.pdf",
        "createdAt": "2017-11-07T13:03:24Z",
        "size": 3746352,
        "createdBy": {
          "id": "b13a2df1072e47339038ddf2de231231",
          "name": "Kristine Knight",
          "username": "kristine.knight@example.com",
          "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        },
        "additionalFormats": []
      }
    }
  }
]
```

### Description

List all items in a library.

### Method

`GET`

### Query parameters

| Name     | Type    | Description                                                                                                                                                                                                                                                           |
| -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parentId |  String |  Optional unique identifier representing the parent item of the library items. Represented as compacted UUID using 32 hexadecimal characters. Setting this will only list the items with this parentId. To specify the root items, set parentId to the string 'root'. |

The following query parameters is in alpha, and might change at any time

| Name            | Type   | Description                                                                                                                                                                       |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| labels          | String | Optional comma separated list of label ids. Will filter the result on these labels.                                                                                               |
| search          | String | Optional search text. Will filter the result to only contain items matching the search.                                                                                           |
| createdAtFrom   | String | Optional date on the iso 8601 format. Will filter the result to only contain items created after this date.                                                                       |
| createdAtTo     | String | Optional date on the iso 8601 format. Will filter the result to only contain items created before this date.                                                                      |
| publishedAtFrom | String | Optional date on the iso 8601 format. (Only supported in document library). Will filter the result to only contain items with the last revision being published after this date.  |
| publishedAtTo   | String | Optional date on the iso 8601 format. (Only supported in document library). Will filter the result to only contain items with the last revision being published before this date. |
| include         | String | Optional. Comma separated list of referenced properties that will be added to the result items. Possible values: 'labels', 'labelGroups'.                                         |

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items`

### Response format

`application/json`

### Response

Returns an array of [LibraryItem](#libraryitem).

### Errors

| Status          | Code           | Message                                                      |
| --------------- | -------------- | ------------------------------------------------------------ |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found                                 |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found                                 |
| 404 Not Found   | 20 NOT_FOUND   | Label(s) not found: (:labels)                                |
| 400 Bad Request | 24 BAD_REQUEST | Failed to parse date (:date). Must be on the iso 8601 format |

## Get library item

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"
```

```json
{
  "id": "a002411fa6454b6facb70bd225dc03bf",
  "name": "example.pdf",
  "parentId": "e01b197c889846c89ffc26fcb58a939a",
  "document": {
    "type": "file",
    "revision": {
      "id": "30132dd4d07a445b81cb527cc6bc813b",
      "version": 2,
      "name": "the-uploaded-file-name.pdf",
      "createdAt": "2017-11-07T13:03:24Z",
      "size": 3746352,
      "createdBy": {
        "id": "b13a2df1072e47339038ddf2de231231",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com",
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
      },
      "additionalFormats": []
    }
  }
}
```

### Description

Get a library item.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item`

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns a [LibraryItem](#libraryitem).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND | Library (:library) not found |
| 404 Not Found | 20 NOT_FOUND | Item (:item) not found       |

## Create library item

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"my-folder\", \"parentId\": null, \"document\": { \"type\": \"folder\" } }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items"
```

### Description

Create a library item. This resource is supported for classification and document library items.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items`

### Request parameters

| Name           | Type    | Description                                                                                                                                                                             |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name           |  String | The name of the library item. This is the folder name for document library items.                                                                                                       |
| parentId       |  String |  A unique identifier for the parent of the library item. Represented as compacted UUID using 32 hexadecimal characters. If no parent is present, the parent is the root of the library. |
| document       |  Object |  Fields specific for document library items.                                                                                                                                            |
| classification |  Object | Fields specific for classification library items.                                                                                                                                       |

Document object:

| Name | Type    | Description                                                                    |
| ---- | ------- | ------------------------------------------------------------------------------ |
| type |  String |  The type of document. For this resource, it should always be set to "folder". |

Classification object:

| Name           | Type    | Description                                      |
| -------------- | ------- | ------------------------------------------------ |
| identification |  String |  The classification identification for the item. |
| description    |  String |  Optional description of the classification.     |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the created library item.

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Parent (:item) not found            |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |
| 400 Bad Request | 24 BAD_REQUEST             | Library item name is required       |
| 400 Bad Request | 24 BAD_REQUEST             | The (:field) field is required      |

409 Conflict | 25 CONFLICT | Identification already exists

400 Bad Request | 24 BAD_REQUEST | Unsupported document type (:document-type)
409 Conflict | 25 CONFLICT | Document already exists

## Create library item with binary

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/octet-stream" \
    --header "Bimsync-Params: {\"parentId\": null, \"name\": \"door-236.png\"}" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items"
```

### Description

Upload a library item. Upload is currently supported for the document library.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items`

### Request parameters

Request parameters are passed as JSON in the HTTP header `Bimsync-Params`.

| Name                 | Type               | Description                                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                 |  String            | The name of the library item. This is the name of the document for the document library.                                                                                                                                                                                                    |
| parentId             |  String            |  A unique identifier for the parent of the library item. Represented as compacted UUID using 32 hexadecimal characters. If no parent is present, the parent is the root of the library.                                                                                                     |
| document             |  Object            |  Fields specific for document library items.                                                                                                                                                                                                                                                |
| failOnDocumentExists | Boolean (Optional) | (Only supported for documents). Specifies the behaviour where there already exist a document with the same name in the folder. If set to **true** the request will fail with **25 CONFLICT**. If not set to **true**, the file will be uploaded as a new revision to the existing document. |

If the library item is a document, the document object is required:

| Name     | Type    | Description                                                                                                                             |
| -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| type     |  String |  The type of document. For this resource, it should always be set to "file".                                                            |
| filename |  String |  This is the name of the uploaded document revision. The name of the document is specified in the name field in the request parameters. |

### Request format

`application/octet-stream`

### Response format

`application/json`

### Response

Returns the uploaded library item.

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Parent (:item) not found            |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |

400 Bad Request | 24 BAD_REQUEST | Document field is required
400 Bad Request | 24 BAD_REQUEST | Filename field is required
400 Bad Request | 24 BAD_REQUEST | Unsupported document type (:document-type)
409 Conflict | 25 CONFLICT | Document already exists

## Update library item

> Examples

```shell
curl -X PATCH \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"name\": \"new-name\"} }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"

curl -X PATCH \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \
        \"labelsToAdd\": [ \
           {\"id": \"a196efd4f5ca4ac8b52f926e7b9dfcbc\"}, \
           {\"name": \"Name of an existing label\"}, \
           {\"name": \"Name of a new label\"} \
        ], \
        \"labelsToRemove\": [ \
           {\"id": \"0de1d3986ff241c08bffc2a01691f3e9\"}, \
           {\"name": \"Name of a label to remove\"} \
        ] \
    }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"
```

### Description

Update a library item. Currently the document library is the only supported library. Updating labels, the name or the parentId at the same time is not supported.

### Method

`PATCH`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items`

### Request parameters

| Name           | Type            | Description                                                                                                                                                                        |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name           |  String         | The name of the library item. This is the new name for the library item.                                                                                                           |
| parentId       |  String         |  A unique identifier for the new parent of the library item. Represented as compacted UUID using 32 hexadecimal characters. If no parent is present the item will keep its parent. |
| labelsToAdd    |  List of labels |  A list of labels to add to the library item.                                                                                                                                      |
| labelsToRemove |  List of labels |  A list of labels to remove from the library item.                                                                                                                                 |

Label object:

| Name | Type    | Description                                                                                                                                                                                           |
| ---- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id   |  String |  Optional identification of the label. A label with that id must exist in the project                                                                                                                 |
| name |  String |  Optional name of the label. Must be present if id is omitted. If a label with that name (case insensitive match) exists in the project, that label will be used. If not, a new label will be created |

### Request format

`application/json`

### Response format

`application/json`

### Response

Returns the updated library item.

### Errors

| Status          | Code                       | Message                                           |
| --------------- | -------------------------- | ------------------------------------------------- |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege                            |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found                      |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found                      |
| 404 Not Found   | 20 NOT_FOUND               | Parent (:item) not found                          |
| 400 Bad Request | 24 BAD_REQUEST             | Input data is missing                             |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported                                     |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type               |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid labels                                    |
| 409 Conflict    | 25 CONFLICT                | Document already exists                           |
| 409 Conflict    | 25 CONFLICT                | Document is already in folder                     |
| 409 Conflict    | 25 CONFLICT                | Can not move a folder into a folder inside itself |

## Download library item

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/octet-stream" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"
```

### Description

Download a library item. Download is currently supported for files in the document library.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item`

### Query parameters

| Name   | Type   | Description                                                                           |
| ------ | ------ | ------------------------------------------------------------------------------------- |
| format | String | _Optional_. Specify other format. Omit the paramater to download the original format. |

### Response format

`application/octet-stream`

### Response

Returns the binary data of the library item if download is supported for the library item.

### Errors

| Status          | Code           | Message                      |
| --------------- | -------------- | ---------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found |
| 404 Not Found   | 20 NOT_FOUND   | Item (:item) not found       |
| 400 Bad Request | 24 BAD_REQUEST | Download not supported       |

## Create download token for library item

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/token"
```

### Description

Create a signed download URL token to allow access to a document without requiring additional authentication. The token will expire in one hour.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/token`

### Query parameters

| Name   | Type   | Description                                                                                     |
| ------ | ------ | ----------------------------------------------------------------------------------------------- |
| format | String | _Optional_. Specify other format. Omit the paramater to create a token for the original format. |

### Response format

`application/json`

### Response

Returns a [DocumentDownloadToken](#documentdownloadtoken).

### Errors

| Status          | Code           | Message                      |
| --------------- | -------------- | ---------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found |
| 404 Not Found   | 20 NOT_FOUND   | Item (:item) not found       |
| 400 Bad Request | 24 BAD_REQUEST | Download not supported       |

## Delete library item

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"
```

```json
{
  "id": "a002411fa6454b6facb70bd225dc03bf",
  "name": "example.pdf",
  "parentId": "e01b197c889846c89ffc26fcb58a939a",
  "document": {
    "type": "file",
    "revision": {
      "id": "30132dd4d07a445b81cb527cc6bc813b",
      "version": 2,
      "name": "the-uploaded-file-name.pdf",
      "createdAt": "2017-11-07T13:03:24Z",
      "size": 3746352,
      "createdBy": {
        "id": "b13a2df1072e47339038ddf2de231231",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com",
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
      },
      "additionalFormats": []
    }
  }
}
```

### Description

Delete a library item.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item`

### Response format

`application/json`

### Response

Returns the deleted [LibraryItem](#libraryitem).

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Item (:item) not found              |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |

## Create library item revision with binary

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/octet-stream" \
    --header "Bimsync-Params: { \"document\": { \"type\": \"file\", \"name\": \"new-revision.jpg\"} }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf"
```

### Description

Create a new revision of a library item. This is currently supported for the document library only.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/revisions`

### Request parameters

Request parameters are passed as JSON in the HTTP header `Bimsync-Params`.

| Name | Type    | Description                                          |
| ---- | ------- | ---------------------------------------------------- |
| name |  String |  This is the name of the uploaded document revision. |

### Request format

`application/octet-stream`

### Response format

`application/json`

### Response

Returns the new library item revision.

### Errors

| Status          | Code                       | Message                             |
| --------------- | -------------------------- | ----------------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found        |
| 404 Not Found   | 20 NOT_FOUND               | Library (:library) not found        |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege              |
| 400 Bad Request | 24 BAD_REQUEST             | Not supported for this library type |

400 Bad Request | 24 BAD_REQUEST | Document field is required
400 Bad Request | 24 BAD_REQUEST | Filename field is required
400 Bad Request | 24 BAD_REQUEST | Unsupported document type (:document-type)

## List library item revisions

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/revisions"
```

```json
[
    {
        "id": "721647359006436e887612871e012a26",
        "version": 2,
        "name": "door-12A.png",
        "createdAt": "2018-01-11T20:11:18Z",
        "size": 32571,
        "createdBy": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        }
    },
    {
        "id": "023509a414074aba82d0be539db748b3",
        "version": 1,
        "name": "window-433C.jpeg",
        "createdAt": "2019-03-08T12:41:21Z",
        "size": 5382,
        "createdBy": {
            "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
            "createdAt": "2016-09-20T14:32:25Z",
            "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
            "name": "Kristine Knight",
            "username": "kristine.knight@example.com"
        }
    }
]
```

### Description

List all revisions for a library item.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/revisions`

### Response format

`application/json`

### Response

Returns an array of [LibraryItemRevisions](#libraryitemrevision).

## Download library item revision

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/octet-stream" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/revisions/e3c44c7a8dda4da590e00ec7465c93cf"
```

### Description

Download a library item revision. Download is currently supported for files in the document library.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/revisions/:revision`

### Query parameters

| Name   | Type   | Description                                                                           |
| ------ | ------ | ------------------------------------------------------------------------------------- |
| format | String | _Optional_. Specify other format. Omit the paramater to download the original format. |

### Response format

`application/octet-stream`

### Response

Returns the binary data of the library item revision if download is supported for the library type.

### Errors

| Status          | Code           | Message                                     |
| --------------- | -------------- | ------------------------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found                |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found                |
| 404 Not Found   | 20 NOT_FOUND   | Library item (:item) not found              |
| 404 Not Found   | 20 NOT_FOUND   | Library item revision (:revision) not found |
| 400 Bad Request | 24 BAD_REQUEST | Not supported for this library type         |

## Create download token for library item revision

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Accept: application/json" \    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/revisions/e3c44c7a8dda4da590e00ec7465c93cf/token"
```

### Description

Create a signed download URL token to allow access to a document revision without requiring additional authentication. The token will expire in one hour.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/revisions/:revision/token`

### Query parameters

| Name   | Type   | Description                                                                                     |
| ------ | ------ | ----------------------------------------------------------------------------------------------- |
| format | String | _Optional_. Specify other format. Omit the paramater to create a token for the original format. |

### Response format

`application/json`

### Response

Returns a [DocumentDownloadToken](#documentdownloadtoken).

### Errors

| Status          | Code           | Message                      |
| --------------- | -------------- | ---------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found |
| 404 Not Found   | 20 NOT_FOUND   | Item (:item) not found       |
| 400 Bad Request | 24 BAD_REQUEST | Download not supported       |

## List library item associations

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/associations"
```

```json
[
  {
    "globalId": "3BY5alwwL00QXHtY2qmHYZ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "2ygVRzJULAQAVpTWUXnVoQ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "3RKRSpPLr5DvG28OTI92HY",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  }
]
```

### Description

List associations between a library item and IFC products. IFC products are represented by their [IfcGloballyUniqueId](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcgloballyuniqueid.htm).

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/associations`

### Response format

`application/json`

### Response

Returns an array of [LibraryItemAssociations](#libraryitemassociation)

## Add library item associations

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
      "[{
          \"globalId\": '3BY5alwwL00QXHtY2qmHYZ'
       },{
          \"objectId\": 32702302
       }, {
          \"objectId\": 32613479
       }]" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/associations"
```

```json
[
  {
    "globalId": "3BY5alwwL00QXHtY2qmHYZ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "2ygVRzJULAQAVpTWUXnVoQ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "3RKRSpPLr5DvG28OTI92HY",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  }
]
```

### Description

Associate a library item to IFC products. IFC products are represented by their [IfcGloballyUniqueId](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcgloballyuniqueid.htm).

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/associations`

### Request format

`application/json`

### Request parameters

The resource accepts an array of objects containing one of the following fields:

| Name     | Type   | Description                                                                                                                                    |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| globalId | String | A 22 character [IfcGloballyUniqueId](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcgloballyuniqueid.htm) |
| _or_     |        |
| objectId | Long   | The object ID of a product in the specified revisions.                                                                                         |

### Query parameters

| Name     | Type                           | Description                                                                                                                                                  |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| revision | Comma separated list of String | _Optional_. Specify which revisions are used to resolve global ID from objectId. If not present, the latest revisions in all models in the project are used. |

### Response format

`application/json`

### Response

Returns an array containing the new [LibraryItemAssociations](#libraryitemassociation)

### Errors

| Status          | Code           | Message                                           |
| --------------- | -------------- | ------------------------------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found                      |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found                      |
| 404 Not Found   | 20 NOT_FOUND   | Item (:item) not found                            |
| 404 Not Found   | 20 NOT_FOUND   | No revisions found                                |
| 400 Bad Request | 24 BAD_REQUEST | GlobalId format is invalid                        |
| 400 Bad Request | 24 BAD_REQUEST | Can not find all specified objectIds in revisions |

## Remove library item associations

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
      "[{
          \"globalId\": '3BY5alwwL00QXHtY2qmHYZ'
       },{
          \"objectId\": 32702302
       }, {
          \"objectId\": 32613479
       }]" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/libraries/e321d95edc8211e5b26e22000ad1b98b/items/a002411fa6454b6facb70bd225dc03bf/associations"
```

```json
[
  {
    "globalId": "3BY5alwwL00QXHtY2qmHYZ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "2ygVRzJULAQAVpTWUXnVoQ",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  },
  {
    "globalId": "3RKRSpPLr5DvG28OTI92HY",
    "user": {
        "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
    },
    "createdAt": "2018-10-04T12:58:33Z"
  }
]
```

### Description

Remove associations between a library item and IFC products.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/libraries/:library/items/:item/associations`

### Request format

`application/json`

### Request parameters

The resource accepts an array of objects containing one of the following fields:

| Name     | Type   | Description                                                                                                                                    |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| globalId | String | A 22 character [IfcGloballyUniqueId](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcgloballyuniqueid.htm) |
| _or_     |        |
| objectId | Long   | The object ID of a product in the specified revisions.                                                                                         |

### Query parameters

| Name     | Type                           | Description                                                                                                                                                  |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| revision | Comma separated list of String | _Optional_. Specify which revisions are used to resolve global ID from objectId. If not present, the latest revisions in all models in the project are used. |

### Response format

`application/json`

### Response

Returns an array containing the removed [LibraryItemAssociations](#libraryitemassociation)

### Errors

| Status          | Code           | Message                                           |
| --------------- | -------------- | ------------------------------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found                      |
| 404 Not Found   | 20 NOT_FOUND   | Library (:library) not found                      |
| 404 Not Found   | 20 NOT_FOUND   | Item (:item) not found                            |
| 404 Not Found   | 20 NOT_FOUND   | No revisions found                                |
| 400 Bad Request | 24 BAD_REQUEST | GlobalId format is invalid                        |
| 400 Bad Request | 24 BAD_REQUEST | Can not find all specified objectIds in revisions |

# Viewer

## Create Viewer3D token

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/viewer3d/token"
```

```json
{
    "revisions": [
        {
            "comment": "Initial revision",
            "createdAt": "2016-09-26T14:45:20Z",
            "id": "25fd3cebaf5d443991d3644cc4d8aa4f",
            "model": {
                "id": "67024671cbd642a9b7c84808b4d509f5",
                "name": "ARCH"
            },
            "user": {
                "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
                "createdAt": "2016-09-20T14:32:25Z",
                "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
                "name": "Kristine Knight",
                "username": "kristine.knight@example.com"
            },
            "version": 1
        },
        {
            "comment": "Initial revision",
            "createdAt": "2016-09-26T14:45:40Z",
            "id": "3dfce8f494ba45e685f3494e89365446",
            "model": {
                "id": "f9b1402d0f9f481484551e422138f8a2",
                "name": "STRUCT"
            },
            "user": {
                "avatarUrl": "https://api.catenda.com/v2/avatar/Q4g778jIuQy40X4jaqF7"
                "createdAt": "2016-09-20T14:32:25Z",
                "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
                "name": "Kristine Knight",
                "username": "kristine.knight@example.com"
            },
            "version": 1
        }
    ],
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IkJnT1BJTVhDMFJEbTZqdyIsImV4cCI6MTQ3NDg5NzU2NiwidXNlcklkIjoiYjhkZDk2NmMtYjZkOC00NGQzLWJiYWEtMjcwNWQ5ZTdkOTgwIiwicmV2aXNpb25JZHMiOlsiMjVmZDNjZWItYWY1ZC00NDM5LTkxZDMtNjQ0Y2M0ZDhhYTRmIiwiM2RmY2U4ZjQtOTRiYS00NWU2LTg1ZjMtNDk0ZTg5MzY1NDQ2Il19.Z-kxNtLnIS0UWI3Y_ESxYVgAGQws1zhah_rSM2aa_Lk",
    "url": "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/viewer3d/data?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IkJnT1BJTVhDMFJEbTZqdyIsImV4cCI6MTQ3NDg5NzU2NiwidXNlcklkIjoiYjhkZDk2NmMtYjZkOC00NGQzLWJiYWEtMjcwNWQ5ZTdkOTgwIiwicmV2aXNpb25JZHMiOlsiMjVmZDNjZWItYWY1ZC00NDM5LTkxZDMtNjQ0Y2M0ZDhhYTRmIiwiM2RmY2U4ZjQtOTRiYS00NWU2LTg1ZjMtNDk0ZTg5MzY1NDQ2Il19.Z-kxNtLnIS0UWI3Y_ESxYVgAGQws1zhah_rSM2aa_Lk"
}
```

### Description

Create a token to load models in [Catenda Viewer3D](https://api.catenda.com/developers/reference/viewer-3d/1.0). By default, access will be granted for the latest revisions in all models.

The token is valid for one hour.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/viewer3d/token`

### Request format

`application/json`

### Request parameters

| Name      | Type            | Description                                     |
| --------- | --------------- | ----------------------------------------------- |
| models    | Array of String | _Optional_. Limit access to a set of models.    |
| revisions | Array of String | _Optional_. Limit access to a set of revisions. |

### Response format

`application/json`

### Response

Returns a [ViewerToken](#viewertoken).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Create Viewer2D token

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json"
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/viewer2d/token"
```

```json
{
  "revisions": [
    {
      "comment": "Initial revision",
      "createdAt": "2016-09-26T14:45:20Z",
      "id": "25fd3cebaf5d443991d3644cc4d8aa4f",
      "model": {
        "id": "67024671cbd642a9b7c84808b4d509f5",
        "name": "ARCH"
      },
      "user": {
        "createdAt": "2016-09-20T14:32:25Z",
        "id": "b8dd966cb6d844d3bbaa2705d9e7d980",
        "name": "Kristine Knight",
        "username": "kristine.knight@example.com"
      },
      "version": 1
    }
  ],
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IkJnT1BJTVhDMFJEbTZqdyIsImV4cCI6MTQ3NDg5NzU2NiwidXNlcklkIjoiYjhkZDk2NmMtYjZkOC00NGQzLWJiYWEtMjcwNWQ5ZTdkOTgwIiwicmV2aXNpb25JZHMiOlsiMjVmZDNjZWItYWY1ZC00NDM5LTkxZDMtNjQ0Y2M0ZDhhYTRmIl19.5hvO-S_IOzrfU1bUupmKosych8Zmpl9ogwTDVOgNyp4",
  "url": "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/viewer2d/geometry?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IkJnT1BJTVhDMFJEbTZqdyIsImV4cCI6MTQ3NDg5NzU2NiwidXNlcklkIjoiYjhkZDk2NmMtYjZkOC00NGQzLWJiYWEtMjcwNWQ5ZTdkOTgwIiwicmV2aXNpb25JZHMiOlsiMjVmZDNjZWItYWY1ZC00NDM5LTkxZDMtNjQ0Y2M0ZDhhYTRmIl19.5hvO-S_IOzrfU1bUupmKosych8Zmpl9ogwTDVOgNyp4"
}
```

### Description

Create a token to load a model in [Catenda Viewer2D](https://api.catenda.com/developers/reference/viewer-2d). By default, access will be granted for the model containing the most doors, windows and walls.

The token is valid for one hour.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/viewer2d/token`

### Request format

`application/json`

### Request parameters

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| model    | String | _Optional_. |
| revision | String | _Optional_. |

### Response format

`application/json`

### Response

Returns a [ViewerToken](#viewertoken).

### Errors

| Status        | Code         | Message                                |
| ------------- | ------------ | -------------------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found           |
| 404 Not Found | 20 NOT_FOUND | Default model not found                |
| 404 Not Found | 20 NOT_FOUND | Model (:model) not found               |
| 404 Not Found | 20 NOT_FOUND | Default model (:model) has no revision |
| 404 Not Found | 20 NOT_FOUND | Model (:model) has no revision         |
| 404 Not Found | 20 NOT_FOUND | Revisions (:revision) not found        |

# IFC Overview

Catenda uses the [IFC](http://www.buildingsmart-tech.org/) data model to store BIM data. The IFC data model is specified in the <a href="https://en.wikipedia.org/wiki/EXPRESS_(data_modeling_language)">EXPRESS</a> modeling language, and is exchanged using the [STEP-File](https://en.wikipedia.org/wiki/ISO_10303-21) format. The [STEP standards](https://en.wikipedia.org/wiki/ISO_10303) are mature mechanisms for data exchange, but can be hard to use directly for many developers. The specifications are not freely available, and some development platforms lack the tools and libraries needed to be able to use the IFC data natively.

Catenda provides resources to make product data available in JSON format. All physical objects (e.g. wall, floor, window) and spatial objects (e.g. space, building, building storey) in a model are [IfcProduct](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifckernel/lexical/ifcproduct.htm) instances in IFC. IfcProduct is represented as [Product](#product) in Catenda. A Product contains most of the explicit attributes of IfcProduct and the most commonly used related entities; such as property sets, quantity sets and types. Other product relations (e.g. layers, structure) can be requested separately. Attributes for [owner/history](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcutilityresource/lexical/ifcownerhistory.htm), product [representation](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifckernel/lexical/ifcproduct.htm) (e.g. 3D geometry) and product placement are ommitted from the Product JSON object.

The JSON format has been designed to be accessible for developers that are not experts in IFC or STEP. The format also exposes how the data is represented in IFC. Entity instances from the model are represented as [Entity](#entity). Explicit attributes are available as [Value](#value). Implicit and derived attributes are not available. A Value is typed with both its IFC type and its JSON type. A Value that represents a physical measure will always contain its unit of measure.

Below is an example of how an [IfcMateral](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcmaterialresource/lexical/ifcmaterial.htm) instance is represented in JSON. The explicit attribute IfcMaterial.Name is available as the field `attributes.Name`. It is assigned a [Value](#value) with IFC type IfcLabel and is represented in JSON as a string. The actual attribute value is available in the field `attributes.Name.value`.

```json
{
  "attributes": {
    "Name": {
      "ifcType": "IfcLabel",
      "type": "string",
      "value": "Wood"
    }
  },
  "ifcType": "IfcMaterial",
  "objectId": 49740000
}
```

# IFC Objects

## Entity

> Example

```json
{
  "attributes": {
    "Name": {
      "ifcType": "IfcLabel",
      "type": "string",
      "value": "Wood"
    }
  },
  "ifcType": "IfcMaterial",
  "objectId": 12345678
}
```

### Description

Represents any IFC entity instance.

### Fields

| Name       | Type                               | Description                                                           |
| ---------- | ---------------------------------- | --------------------------------------------------------------------- |
| objectId   | Long                               | The object ID of the entity.                                          |
| ifcType    | String                             | The entity name.                                                      |
| attributes | Map from String to [Value](#value) | Set of named explicit attribute values. Unset attributes are omitted. |

## Value

> Example

```json
{
  "ifcType": "IfcLabel",
  "type": "string",
  "value": "Wood"
}
```

```json
{
  "ifcType": "IfcSlabTypeEnum",
  "type": "enum",
  "value": "FLOOR"
}
```

```json
{
  "ifcType": "IfcLengthMeasure",
  "type": "number",
  "value": "100.0",
  "unit": "m"
}
```

### Description

Represents a typed value.

### Fields

| Name    | Type   | Description                                                                                                                                                                                                                                                                                                                 |
| ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ifcType | String | The IFC type of the value.                                                                                                                                                                                                                                                                                                  |
| type    | String | The data type of the value. Simple types are _"boolean"_, _"number"_, _"integer"_, _"string"_, _"enum"_. Complex types are _"object"_ or _"array"_.                                                                                                                                                                         |
| unit    | String | Unit of the value.                                                                                                                                                                                                                                                                                                          |
| value   | Object | The value. For data types _"boolean"_, _"number"_, _"integer"_ and _"string"_ the value will be represented a simple JSON value. The data type _"enum"_ is represented as a string. The data type _"object"_ is represented as an [Entity](#entity). The data type _"array"_ is represented as an array of [Value](#value). |

## Property

> Example

```json
{
  "ifcType": "IfcPropertySingleValue",
  "nominalValue": {
    "type": "boolean",
    "ifcType": "IfcBoolean",
    "value": true
  }
}
```

```json
{
    "ifcType": "IfcComplexProperty",
    "properties": {
        "Area": {
            "type": "number",
            "ifcType": "IfcAreaMeasure",
            "value": 5.5,
            "unit": "m²"
        },
        "Volume": {
            "type": "number",
            "ifcType": "IfcVolumeMeasure",
            "value": 0.03,
            "unit": "m³"
        }
}
```

### Description

Represents any of the types of properties that can be associated with IFC objects using property sets.

### Fields

| Name              | Type                                     | Description                                   |
| ----------------- | ---------------------------------------- | --------------------------------------------- |
| description       | String                                   | Value from IfcProperty.Description.           |
| ifcType           | String                                   | The IFC type of the property.                 |
| nominalValue      | [Value](#value)                          | Set if ifcType is IfcPropertySingleValue.     |
| enumerationValues | List of [Value](#value)                  | Set if ifcType is IfcPropertyEnumeratedValue. |
| listValues        | List of [Value](#value)                  | Set if ifcType is IfcPropertyListValue.       |
| lowerBoundValue   | [Value](#value)                          | Set if ifcType is IfcPropertyBoundedValue.    |
| upperBoundValue   | [Value](#value)                          | Set if ifcType is IfcPropertyBoundedValue.    |
| propertyReference | [Value](#value)                          | Set if ifcType is IfcPropertyReferenceValue.  |
| properties        | Map from String to [Property](#property) | Set if ifcType is IfcComplexProperty.         |

## PropertySet

> Example

```json
{
  "revisionId": "305bbb20fae34e80984efa85aa2c0d50",
  "objectId": 12345678,
  "ifcType": "IfcPropertySet",
  "attributes": {
    "GlobalId": {
      "type": "string",
      "ifcType": "IfcGloballyUniqueId",
      "value": "2AAAJgvmbEC9V$1uI4oGt6"
    },
    "Name": {
      "type": "string",
      "ifcType": "IfcLabel",
      "value": "Pset_WindowCommon"
    }
  },
  "properties": {
    "IsExternal": {
      "ifcType": "IfcPropertySingleValue",
      "nominalValue": {
        "type": "boolean",
        "ifcType": "IfcBoolean",
        "value": false
      }
    }
  }
}
```

### Description

Represents a property set ([IfcPropertySet](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifckernel/lexical/ifcpropertyset.htm)). A property set is an [Entity](#entity) containing a set of named properties. Property sets with names starting with "Pset\_" are predefined in the [Property Sets Definition](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/psd/psd_index.htm).

### Fields

| Name       | Type                                     | Description                                                           |
| ---------- | ---------------------------------------- | --------------------------------------------------------------------- |
| objectId   | Long                                     | The object ID of the property set.                                    |
| ifcType    | String                                   | The IFC type of the property set.                                     |
| attributes | Map from String to [Value](#value)       | Set of named explicit attribute values. Unset attributes are omitted. |
| revisionId | String                                   | The [Revision](#revision) containing the property set.                |
| properties | Map from String to [Property](#property) | Set of named properties.                                              |

## Quantity

Represents a physical quantity that can be associated with IFC objects using quantity sets.

### Description

### Fields

| Name        | Type            | Description                                 |
| ----------- | --------------- | ------------------------------------------- |
| description | String          | Value from IfcPhysicalQuantity.Description. |
| ifcType     | String          | The IFC type of the quantity.               |
| value       | [Value](#value) | The value of the quantity.                  |

## QuantitySet

### Description

Represents a quantity set ([IfcElementQuantity](http://www.buildingsmart-tech.org/ifc/IFC2x3/TC1/html/ifcproductextension/lexical/ifcelementquantity.htm)). A property set is an [Entity](#entity) containing a set of named quantities.

### Fields

| Name       | Type                                     | Description                                                           |
| ---------- | ---------------------------------------- | --------------------------------------------------------------------- |
| objectId   | Long                                     | The object ID of the quantity set.                                    |
| ifcType    | String                                   | The IFC type of the quantity set.                                     |
| attributes | Map from String to [Value](#value)       | Set of named explicit attribute values. Unset attributes are omitted. |
| revisionId | String                                   | The [Revision](#revision) containing the property set.                |
| properties | Map from String to [Quantity](#quantity) | Set of named quantities.                                              |

## Type

### Description

Represents common type information associated with a [Product](#product).

### Fields

| Name         | Type                                           | Description                                                           |
| ------------ | ---------------------------------------------- | --------------------------------------------------------------------- |
| objectId     | Long                                           | The object ID of the type.                                            |
| ifcType      | String                                         | The IFC type of the type.                                             |
| attributes   | Map from String to [Value](#value)             | Set of named explicit attribute values. Unset attributes are omitted. |
| revisionId   | String                                         | The [Revision](#revision) containing the product.                     |
| propertySets | Map from String to [PropertySet](#propertyset) | Set of named property sets associated with the type.                  |
| quantitySets | Map from String to [QuantitySet](#quantityset) | Set of named quantity sets associated with the type.                  |
| materials    | List of [Entity](#entity)                      | List of materials associated with the type.                           |

## Product

### Description

Represents physical products or spatial items.

### Fields

| Name         | Type                                           | Description                                                           |
| ------------ | ---------------------------------------------- | --------------------------------------------------------------------- |
| objectId     | Long                                           | The object ID of the product.                                         |
| ifcType      | String                                         | The IFC type of the product set.                                      |
| attributes   | Map from String to [Value](#value)             | Set of named explicit attribute values. Unset attributes are omitted. |
| revisionId   | String                                         | The [Revision](#revision) containing the product.                     |
| propertySets | Map from String to [PropertySet](#propertyset) | Set of named property sets associated with the product.               |
| quantitySets | Map from String to [QuantitySet](#quantityset) | Set of named quantity sets associated with the product.               |
| materials    | List of [Entity](#entity)                      | List of materials associated with the product.                        |
| type         | [Type](#type)                                  | The common type information associated with the product.              |

## Query

> Example

```json
{
  "ifcType": { "$ifcType": "IfcWall" }
}
```

### Introduction

Catenda allows you to query IFC entities using a query language. Queries are
represented as JSON. The language is similar to [MongoDB query filter documents](https://docs.mongodb.com/manual/core/document/#document-query-filter).

### Operators

| Name     | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| $and     | Match entities where all expressions in an array of expressions return a match. |
| $eq      | Match entities that are equal to a value.                                       |
| $ifcType | Match entities that are equal to an IFC type or its subtypes.                   |
| $in      | Match entities that are equal to any value in an array.                         |

### $and

#### Description

$and operator performs a logical AND operation on two or more expressions.
Only entities matching all expressions are selected.

#### Syntax

`{ $and: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }`

### $eq

#### Description

$eq operator selects entities where the value of a field equals the specified
value.

#### Syntax

`{ <field>: { $eq: <value> } }`

This is equivalent to `{ <field>: <value> }`

### $ifcType

### Description

$ifcType operator selects entities where the value of a field equals the
specified IFC type or its subtypes.

### Syntax

`{ <field>: { $ifcType: <string> } }`

### $in

### Description

$in operator selects entities where the value of a field equals any value in
the specified array.

### Syntax

`{ <field>: { $in: [ <value1>, <value2>, ... <valueN> ] } }`

# IFC Resources

## Get product

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json"
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/ifc/products/49739989"
```

```json
{
  "attributes": {
    "GlobalId": {
      "ifcType": "IfcGloballyUniqueId",
      "type": "string",
      "value": "1AAAJgvmbEC9V$1uI4oGt6"
    },
    "Name": {
      "ifcType": "IfcLabel",
      "type": "string",
      "value": "S\u00f8yle-01"
    },
    "ObjectType": {
      "ifcType": "IfcLabel",
      "type": "string",
      "value": null
    },
    "Tag": {
      "ifcType": "IfcIdentifier",
      "type": "string",
      "value": "4A28A4EA-E709-4E30-97-FF-078484C90DC6"
    }
  },
  "ifcType": "IfcColumn",
  "materials": [
    {
      "attributes": {
        "Name": {
          "ifcType": "IfcLabel",
          "type": "string",
          "value": "Limtre"
        }
      },
      "ifcType": "IfcMaterial",
      "objectId": 49740000
    }
  ],
  "objectId": 49739989,
  "propertySets": [],
  "quantitySets": [],
  "type": null
}
```

### Description

Get a product.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products/:product`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

Returns a [Product](#product).

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |
| 404 Not Found | 20 NOT_FOUND | Product (:product) not found   |

## List products

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json"
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/ifc/products"
```

```json
[
  {
    "attributes": {
      "GlobalId": {
        "ifcType": "IfcGloballyUniqueId",
        "type": "string",
        "value": "1AAAJgvmbEC9V$1uI4oGt6"
      },
      "Name": {
        "ifcType": "IfcLabel",
        "type": "string",
        "value": "S\u00f8yle-01"
      },
      "ObjectType": {
        "ifcType": "IfcLabel",
        "type": "string",
        "value": null
      },
      "Tag": {
        "ifcType": "IfcIdentifier",
        "type": "string",
        "value": "4A28A4EA-E709-4E30-97-FF-078484C90DC6"
      }
    },
    "ifcType": "IfcColumn",
    "materials": [
      {
        "attributes": {
          "Name": {
            "ifcType": "IfcLabel",
            "type": "string",
            "value": "Limtre"
          }
        },
        "ifcType": "IfcMaterial",
        "objectId": 49740000
      }
    ],
    "objectId": 49739989,
    "propertySets": [],
    "quantitySets": [],
    "type": null
  }
]
```

### Description

List all products in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| ifcType  | String         | _Optional_. Filter by IFC type.  |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Returns an array of [Product](#product).

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Query products

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data \
        "{ \"query\": {
               \"ifcType\": {
                 \"$ifcType\": \"IfcWall"\
               }
           },
           \"fields\": {
               \"attributes.Name\": 1,
               \"attributes.GlobalId\": 1
           }
        }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/ifc/products"
```

```json
[
  {
    "attributes": {
      "GlobalId": {
        "ifcType": "IfcGloballyUniqueId",
        "type": "string",
        "value": "0EKxnFdcP6l9dG0OxZbFYB"
      },
      "Name": {
        "ifcType": "IfcLabel",
        "type": "string",
        "value": "01"
      }
    },
    "ifcType": "IfcWallStandardCase",
    "materials": [],
    "objectId": 49650074,
    "propertySets": [],
    "quantitySets": [],
    "type": null
  }
]
```

### Description

Query all products in a project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Request format

`application/json`

### Request parameters

| Name   | Type            | Description                                                                                                                                                        |
| ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fields | Object          | _Optional_ The fields to return. All fields are returned by default. Setting &lt;field&gt; to 1 includes the field. Setting &lt;field&gt; to 0 excludes the field. |
| query  | [Query](#query) | The query object.                                                                                                                                                  |

### Response format

`application/json`

### Response

Returns an array of [Product](#product).

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get products type summary

### Description

Get the number of instances per IFC type for products.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products/ifctypes`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Map from String to Integer. Represents the number of instances per IFC type
name.

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get product relations

### Description

Get the relations for a product.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products/:product/relations`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

<a href="#product-relation">ProductRelations</a>

## List product relations

### Description

List the relations for all the products in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/products/relations`

### Query parameters

| Name     | Type           | Description                        |
| -------- | -------------- | ---------------------------------- |
| model    | List of String | _Optional_. Filter by models.      |
| revision | List of String | _Optional_. Filter by revisions.   |
| pageSize | Integer        | _Optional_. Default 100, max 1000. |

### Response format

`application/json`

### Response

Array of <a href="#product-relations">ProductRelations</a>

## Get type

### Description

Get a type.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types/:type`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Type](#type)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |
| 404 Not Found | 20 NOT_FOUND | Type (:type) not found         |

## List types

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json"
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/ifc/types"
```

```json
[
  {
    "attributes": {
      "GlobalId": {
        "ifcType": "IfcGloballyUniqueId",
        "type": "string",
        "value": "1AAAJgvmbEC9V$1uI4oGt6"
      },
      "Name": {
        "ifcType": "IfcLabel",
        "type": "string",
        "value": "S\u00f8yle-01"
      },
      "ObjectType": {
        "ifcType": "IfcLabel",
        "type": "string",
        "value": null
      },
      "Tag": {
        "ifcType": "IfcIdentifier",
        "type": "string",
        "value": "4A28A4EA-E709-4E30-97-FF-078484C90DC6"
      }
    },
    "ifcType": "IfcColumn",
    "materials": [
      {
        "attributes": {
          "Name": {
            "ifcType": "IfcLabel",
            "type": "string",
            "value": "Limtre"
          }
        },
        "ifcType": "IfcMaterial",
        "objectId": 49740000
      }
    ],
    "objectId": 49739989,
    "propertySets": [],
    "quantitySets": [],
    "type": null
  }
]
```

### Description

List all types in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| ifcType  | String         | _Optional_. Filter by IFC type.  |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Type](#type)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Query types

### Description

Query all types in a project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Request format

`application/json`

### Request parameters

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| fields | Fields |
| query  | Query  |

### Response format

`application/json`

### Response

Array of [Type](#type)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get types type summary

### Description

Get the number of instances per IFC type for types.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types/ifctypes`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Map from String to Integer. Represents the number of instances per IFC type
name.

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get type relations

### Description

Get the relations for a type.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types/:type/relations`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

<a href="#type-relations">TypeRelations</a>

## List type relations

### Description

List the relations for all the types in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/types/relations`

### Query parameters

| Name     | Type           | Description                        |
| -------- | -------------- | ---------------------------------- |
| model    | List of String | _Optional_. Filter by models.      |
| revision | List of String | _Optional_. Filter by revisions.   |
| pageSize | Integer        | _Optional_. Default 100, max 1000. |

### Response format

`application/json`

### Response

Array of <a href="#type-relations">TypeRelations</a>

## Get group

### Description

Get a group.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups/:group`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Group](#group)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |
| 404 Not Found | 20 NOT_FOUND | Group (:group) not found       |

## List groups

### Description

List all groups in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| ifcType  | String         | _Optional_. Filter by IFC type.  |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Group](#group)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Query groups

### Description

Query all groups in a project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Request format

`application/json`

### Request parameters

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| fields | Fields |
| query  | Query  |

### Response format

`application/json`

### Response

Array of [Group](#group)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get groups type summary

### Description

Get the number of instances per IFC type for groups.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups/ifctypes`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Map from String to Integer. Represents the number of instances per IFC type name.

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get group relations

### Description

Get the relations for a group.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups/:group/relations`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

<a href="#group-relations">GroupRelations</a>

## List group relations

### Description

List the relations for all the group in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/groups/relations`

### Query parameters

| Name     | Type           | Description                        |
| -------- | -------------- | ---------------------------------- |
| model    | List of String | _Optional_. Filter by models.      |
| revision | List of String | _Optional_. Filter by revisions.   |
| pageSize | Integer        | _Optional_. Default 100, max 1000. |

### Response format

`application/json`

### Response

Array of <a href="#group-relations">GroupRelations</a>

## Get layer

### Description

Get a layer.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers/:layer`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Layer](#layer)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |
| 404 Not Found | 20 NOT_FOUND | Layer (:layer) not found       |

## List layers

### Description

List all layers in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| ifcType  | String         | _Optional_. Filter by IFC type.  |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Layer](#layer)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Query layers

### Description

Query all layers in a project.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Request format

`application/json`

### Request parameters

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| fields | Fields |
| query  | Query  |

### Response format

`application/json`

### Response

Array of [Layer](#layer)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get layers type summary

### Description

Get the number of instances per IFC type for layers.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers/ifctypes`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Map from String to Integer. Represents the number of instances per IFC type
name.

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get layer relations

### Description

Get the relations for a layer.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers/:layer/relations`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

<a href="#layer-relations">LayerRelations</a>

## List layer relations

### Description

List the relations for all the layers in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/layers/relations`

### Query parameters

| Name     | Type           | Description                        |
| -------- | -------------- | ---------------------------------- |
| model    | List of String | _Optional_. Filter by models.      |
| revision | List of String | _Optional_. Filter by revisions.   |
| pageSize | Integer        | _Optional_. Default 100, max 1000. |

### Response format

`application/json`

### Response

Array of <a href="#layer-relations">LayerRelations</a>

## Get owner/history

### Description

Get an owner/history entity.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/ownerhistory/:ownerhistory`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Entity](#entity)

### Errors

| Status        | Code         | Message                                 |
| ------------- | ------------ | --------------------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found            |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found          |
| 404 Not Found | 20 NOT_FOUND | Owner/history (:ownerhistory) not found |

## List owner/history

### Description

List all owner/history entities in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/ownerhistory`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Entity](#entity)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get classification

### Description

Get a classification entity.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classifications/:classification`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Entity](#entity)

### Errors

| Status        | Code         | Message                                    |
| ------------- | ------------ | ------------------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found               |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found             |
| 404 Not Found | 20 NOT_FOUND | Classification (:classification) not found |

## List classifications

### Description

List all classification entities in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classifications`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Entity](#entity)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get classification relations

### Description

Get the relations for a classification.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classifications/:classification/relations`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

<a href="#classification-relations">ClassificationRelations</a>

## Get classification reference

### Description

Get a classification reference entity.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classification_references/:reference`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

[Entity](#entity)

### Errors

| Status        | Code         | Message                                         |
| ------------- | ------------ | ----------------------------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found                    |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found                  |
| 404 Not Found | 20 NOT_FOUND | Classification reference (:reference) not found |

## List classification references

### Description

List all classification reference entities in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classification_references`

### Query parameters

| Name     | Type           | Description                      |
| -------- | -------------- | -------------------------------- |
| model    | List of String | _Optional_. Filter by models.    |
| revision | List of String | _Optional_. Filter by revisions. |

### Response format

`application/json`

### Response

Array of [Entity](#entity)

### Errors

| Status        | Code         | Message                        |
| ------------- | ------------ | ------------------------------ |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found   |
| 404 Not Found | 20 NOT_FOUND | Revision (:revision) not found |

## Get classification reference relations

### Description

Get the relations for a classification reference.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classification_references/:reference/relations`

### Query parameters

| Name     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| revision | String | _Optional_. Filter by revision. |

### Response format

`application/json`

### Response

<a href="#classificaton-reference-relations">ClassificationReferenceRelations</a>

## List classification reference relations

### Description

List the relations for all the classification references in a project.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/ifc/classification_references/relations`

### Query parameters

| Name     | Type           | Description                        |
| -------- | -------------- | ---------------------------------- |
| model    | List of String | _Optional_. Filter by models.      |
| revision | List of String | _Optional_. Filter by revisions.   |
| pageSize | Integer        | _Optional_. Default 100, max 1000. |

### Response format

`application/json`

### Response

Array of <a href="#classificaton-reference-relations">ClassificationReferenceRelations</a>

# Webhooks

## Events

See [Webhook](#webhook) for a list of supported Webhook events.

## List subscriptions

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/webhooks/user"
```

```json
[
  {
    "id": "47d5457e09d64380af75ea94ed96557d",
    "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
    "createdAt": "2019-02-13T14:15:18Z",
    "state": "ENABLED",
    "failureCount": 0,
    "event": "model.created"
  }
]
```

### Description

List Webhook subscriptions for the current user.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/webhooks/user`

### Response format

`application/json`

### Response

Returns a list of [Webhook](#webhook).

### Errors

| Status        | Code         | Message                      |
| ------------- | ------------ | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND | Project (:project) not found |

## Get subscription

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/webhooks/user/47d5457e09d64380af75ea94ed96557d"
```

```json
{
  "id": "47d5457e09d64380af75ea94ed96557d",
  "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
  "createdAt": "2019-02-13T14:15:18Z",
  "state": "ENABLED",
  "failureCount": 0,
  "event": "model.created"
}
```

### Description

Get a single Webhook subscription for the current user.

### Method

`GET`

### URL

`https://api.catenda.com/v2/projects/:project/webhooks/user/:webhook`

### Response format

`application/json`

### Response

Returns the [Webhook](#webhook).

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Webhook (:webhook) not found |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |

## Create subscription

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"target_url\": \"https://hooks.zapier.com/hooks/catch/1028857/a8w0or/\", \"event\": \"model.created\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/webhooks/user"
```

```json
{
  "id": "47d5457e09d64380af75ea94ed96557d",
  "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
  "createdAt": "2019-02-13T14:15:18Z",
  "state": "ENABLED",
  "failureCount": 0,
  "event": "model.created"
}
```

### Description

Create a Webhook subscription for the current user.

### Method

`POST`

### URL

`https://api.catenda.com/v2/projects/:project/webhooks/user`

### Request format

`application/json`

### Request parameters

| Name       | Type   | Description                                                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| target_url | String | The URL to be called when the event occur.                                                                               |
| event      | String | An event which triggers a callback to the specified URL. See [Webhook](#webhook) for a list of supported webhook events. |

### Response format

`application/json`

### Response

Returns the [Webhook](#webhook).

### Errors

| Status          | Code           | Message                      |
| --------------- | -------------- | ---------------------------- |
| 404 Not Found   | 20 NOT_FOUND   | Project (:project) not found |
| 400 Bad Request | 24 BAD_REQUEST | Invalid url                  |
| 404 Not Found   | 20 NOT_FOUND   | Unknown event                |

## Update subscription

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \"target_url\": \"https://hooks.zapier.com/hooks/catch/1028857/b8w0or/\", \"event\": \"model.created\" }" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/webhooks/user/47d5457e09d64380af75ea94ed96557d"
```

```
{
    "id": "47d5457e09d64380af75ea94ed96557d",
    "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
    "createdAt": "2019-02-13T14:15:18Z",
    "state": "ENABLED",
    "failureCount": 0,
    "event": "model.created"
}
```

### Description

Update a Webhook subscription for the current user.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/projects/:project/webhooks/user/:webhook`

### Request format

`application/json`

### Request parameters

| Name       | Type   | Description                                                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| target_url | String | The URL to be called when the event occur.                                                                               |
| state      | String | The state of the Webhook. Valid values are 'ENABLED' or 'DISABLED_BY_USER'.                                              |
| event      | String | An event which triggers a callback to the specified URL. See [Webhook](#webhook) for a list of supported webhook events. |

### Response format

`application/json`

### Response

The updated [Webhook](#webhook).

### Errors

| Status          | Code                       | Message                      |
| --------------- | -------------------------- | ---------------------------- |
| 404 Not Found   | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found   | 20 NOT_FOUND               | Webhook (:webhook) not found |
| 403 Forbidden   | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |
| 400 Bad Request | 24 BAD_REQUEST             | Invalid url                  |
| 404 Not Found   | 20 NOT_FOUND               | Unknown event                |

## Delete subscription

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/projects/af2d8af0fa54465b89bf26dd3d92cfd0/webhooks/user/47d5457e09d64380af75ea94ed96557d"
```

```
{
    "id": "47d5457e09d64380af75ea94ed96557d",
    "target_url": "https://hooks.zapier.com/hooks/catch/1028857/a8w0or/",
    "createdAt": "2019-02-13T14:15:18Z",
    "state": "ENABLED",
    "failureCount": 0,
    "event": "model.created"
}
```

### Description

Delete a Webhook subscription for the current user.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/projects/:project/webhooks/user/:webhook`

### Response format

`application/json`

### Response

The deleted [Webhook](#webhook).

### Errors

| Status        | Code                       | Message                      |
| ------------- | -------------------------- | ---------------------------- |
| 404 Not Found | 20 NOT_FOUND               | Project (:project) not found |
| 404 Not Found | 20 NOT_FOUND               | Webhook (:webhook) not found |
| 403 Forbidden | 100 INSUFFICIENT_PRIVILEGE | Insufficient privilege       |

# SCIM

The System for Cross-domain Identity Management (SCIM) specification is an HTTP-based protocol that makes managing identities in multi-domain scenarios easier to support via a standardized service. See [RFC7644](https://datatracker.ietf.org/doc/html/rfc7644) for detailed information.

To access the SCIM API you will need to access the API using client credentials flow as an organization. If you do not have
any organization please contact support.

The users returned by the SCIM endpoints will include all users for domains that the organization owns. Please contact support setting up owned domains.

## Discovery Services

SCIM defines three endpoints to facilitate discovery of SCIM service provider features and schema that can be retrieved using HTTP GET for ServiceProviderConfig, Schemas or ResourceTypes.

## ServiceProviderConfig

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/scim/v2/ServiceProviderConfig"
```

### Description

An HTTP GET to this endpoint will return a JSON structure that describes the SCIM specification features available. This endpoint returns responses with a JSON object using a "schemas" attribute of "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig".

### Method

`GET`

### URL

`https://api.catenda.com/v2/scim/v2/ServiceProviderConfig`

### Response format

`application/scim+json`

### Response

Returns a JSON object with available services.

## Schemas

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/scim/v2/Schemas"
```

### Description

An HTTP GET to the Schemas endpoint is used to retrieve schema information and returns all supported schemas in ListResponse format. Individual schema definitions can be returned by appending the schema URI to the /Schemas endpoint. For example: /Schemas/urn:ietf:params:scim:schemas:core:2.0:User.

### Method

`GET`

### URL

`https://api.catenda.com/v2/scim/v2/Schemas`

### Response format

`application/scim+json`

### Response

Returns a JSON object with available schemas.

## ResourceTypes

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/scim/v2/ResourceTypes"
```

### Description

An HTTP GET to this endpoint is used to discover the types of resources available (e.g., Users and Groups). Each resource type defines the endpoints, the core schema URI that defines the resource, and any supported schema extensions.

### Method

`GET`

### URL

`https://api.catenda.com/v2/scim/v2/ResourceTypes`

### Response format

`application/scim+json`

### Response

Returns a JSON object with available types of resources.

## Get SCIM user

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    "https://api.catenda.com/v2/scim/v2/Users/47d5457e09d64380af75ea94ed96557d"
```

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "2819c223-7f76-453a-919d-413861904646",
  "externalId": "bjensen",
  "meta": {
    "resourceType": "User",
    "created": "2011-08-01T18:29:49.793Z",
    "lastModified": "2011-08-01T18:29:49.793Z",
    "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
    "version": "W/\"f250dd84f0671c3\""
  },
  "name": {
    "formatted": "Ms. Barbara J Jensen III",
    "familyName": "Jensen",
    "givenName": "Barbara"
  },
  "userName": "bjensen@somewhere.com",
  "phoneNumbers": [
    {
      "value": "555-555-8377",
      "type": "work"
    }
  ],
  "emails": [
    {
      "value": "bjensen@example.com",
      "type": "work"
    }
  ]
}
```

### Description

Retrieve a single User.

### Method

`GET`

### URL

`https://api.catenda.com/v2/scim/v2/Users/:id`

### Response format

`application/scim+json`

### Response

Returns a JSON object with the user.

## Create SCIM user

> Example

```shell
curl -X POST \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \
     \"schemas\" :[\"urn:ietf:params:scim:schemas:core:2.0:User\"], \
     \"userName\": \"bjensen@somewhere.com\", \
     \"externalId\": \"bjensen\", \
     \"name\" :{ \
       \"formatted\": \"Ms. Barbara J Jensen III\", \
       \"familyName\": \"Jensen\", \
       \"givenName\": \"Barbara\" \
     }, \
     \"emails\" :[ \
       { \
         \"value\": \"bjensen@example.com\", \
         \"primary\": true, \
         \"type\": \"work\" \
       }] \
   }" \
    "https://api.catenda.com/v2/scim/v2/Users"
```

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "2819c223-7f76-453a-919d-413861904646",
  "externalId": "bjensen",
  "meta": {
    "resourceType": "User",
    "created": "2011-08-01T18:29:49.793Z",
    "lastModified": "2011-08-01T18:29:49.793Z",
    "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
    "version": "W/\"f250dd84f0671c3\""
  },
  "name": {
    "formatted": "Ms. Barbara J Jensen III",
    "familyName": "Jensen",
    "givenName": "Barbara"
  },
  "userName": "bjensen@somewhere.com",
  "emails": [
    {
      "value": "bjensen@example.com",
      "primary": true,
      "type": "work"
    }
  ]
}
```

### Description

Create a single User. If the user exists as an active or deleted user, the call will fail with SCIM status `conflict`.
You can only create users where the username ends with an owned domain.

### Method

`POST`

### URL

`https://api.catenda.com/v2/scim/v2/Users`

### Response format

`application/scim+json`

### Response

Returns a JSON object with the user created.

## Search SCIM user

> Example

```shell
curl -X GET \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    "https://api.catenda.com/v2/scim/v2/Users?count=100&startIndex=0"
```

```json
{
  "totalResults": 1,
  "itemsPerPage": 10,
  "startIndex": 1,
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
  "Resources": [
    {
      "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
      "id": "2819c223-7f76-453a-919d-413861904646",
      "externalId": "bjensen",
      "meta": {
        "resourceType": "User",
        "created": "2011-08-01T18:29:49.793Z",
        "lastModified": "2011-08-01T18:29:49.793Z",
        "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
        "version": "W/\"f250dd84f0671c3\""
      },
      "name": {
        "formatted": "Ms. Barbara J Jensen III",
        "familyName": "Jensen",
        "givenName": "Barbara"
      },
      "userName": "bjensen@somewhere.com",
      "emails": [
        {
          "value": "bjensen@example.com",
          "primary": true,
          "type": "work"
        }
      ]
    }
  ]
}
```

### Description

Search users.

### Method

`GET`

### URL

`https://api.catenda.com/v2/scim/v2/Users`

### Response format

`application/scim+json`

### Response

Returns a JSON object with the users matching the search.

## Replace SCIM user

> Example

```shell
curl -X PUT \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{ \
     \"schemas\":[\"urn:ietf:params:scim:schemas:core:2.0:User\"], \
     \"userName\":\"bjensen@somewhere.com\", \
     \"externalId\":\"bjensen\", \
     \"name\":{ \
       \"formatted\":\"Ms. Barbara J Jensen III\", \
       \"familyName\":\"Jensen\", \
       \"givenName\":\"Barbara\" \
     }, \
     \"emails\" :[ \
       { \
         \"value\": \"bjensen@example.com\", \
         \"primary\": true, \
         \"type\": \"work\" \
       }] \
   }" \
    "https://api.catenda.com/v2/scim/v2/Users"
```

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "2819c223-7f76-453a-919d-413861904646",
  "externalId": "bjensen",
  "meta": {
    "resourceType": "User",
    "created": "2011-08-01T18:29:49.793Z",
    "lastModified": "2011-08-01T18:29:49.793Z",
    "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
    "version": "W/\"f250dd84f0671c3\""
  },
  "name": {
    "formatted": "Ms. Barbara J Jensen III",
    "familyName": "Jensen",
    "givenName": "Barbara"
  },
  "userName": "bjensen@somewhere.com",
  "emails": [
    {
      "value": "bjensen@example.com",
      "type": "work"
    }
  ]
}
```

### Description

Replace user. This will update all the fields of an user with the given username.

### Method

`PUT`

### URL

`https://api.catenda.com/v2/scim/v2/Users/:id`

### Response format

`application/scim+json`

### Response

Returns a JSON object with the updated user.

## Delete SCIM user

> Example

```shell
curl -X DELETE \
    --header "Authorization: Bearer $ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    "https://api.catenda.com/v2/scim/v2/Users/:id"
```

```json
{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "2819c223-7f76-453a-919d-413861904646",
  "externalId": "bjensen",
  "meta": {
    "resourceType": "User",
    "created": "2011-08-01T18:29:49.793Z",
    "lastModified": "2011-08-01T18:29:49.793Z",
    "location": "https://example.com/v2/Users/2819c223-7f76-453a-919d-413861904646",
    "version": "W/\"f250dd84f0671c3\""
  },
  "name": {
    "formatted": "Ms. Barbara J Jensen III",
    "familyName": "Jensen",
    "givenName": "Barbara"
  },
  "userName": "bjensen@somewhere.com",
  "phoneNumbers": [
    {
      "value": "555-555-8377",
      "type": "work"
    }
  ],
  "emails": [
    {
      "value": "bjensen@example.com",
      "type": "work"
    }
  ]
}
```

### Description

Deletes an user. The user will be marked as deleted and will not be able to access Catenda.

### Method

`DELETE`

### URL

`https://api.catenda.com/v2/scim/v2/Users/:id`

### Response format

`application/scim+json`

### Response

Returns a JSON object with the deleted user.
