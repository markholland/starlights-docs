---
title: Introduction
---

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

## BCF-API v3.0

Go to the official [BCF REST API](https://github.com/BuildingSMART/BCF-API/tree/release_3_0) for full documentation.

BCF-API 3.0 is based on the [OpenCDE Foundation API version 1.0](https://github.com/buildingSMART/foundation-API/tree/release_1_0).
Foundation API describes the authentication process, as well as common methodology.

### What is described here

- All supported API-methods, with some extensions
- bimsync terms

## Issue Boards and BCF

An "issue board" is the same as a BCF project, and an "issue" is the same as a BCF topic.
In bimsync, you may have multiple issue boards in the same project.

**project_id** points to the issue board, while **bimsync_project_id** points to the Catenda project

Users are managed within a Catenda project.
