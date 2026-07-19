---
title: Get a Facebook Page Access Token with cURL
description: Learn how to get a Facebook Page Access Token using cURL
order: 100
---
# Getting a Facebook Page Access Token with cURL

This guide describes how to obtain a **Facebook Page Access Token** for a Page you manage. The token can then be used by scripts (for example, Node.js automation) to publish posts and manage Page content through the Facebook Graph API.

## Prerequisites

You need:

* A Meta Developer App
* A Facebook Page where your personal Facebook account has **Full Control**
* The following environment variables:

```bash
export FACEBOOK_APP_ID="your_app_id"
export FACEBOOK_APP_SECRET="your_app_secret"
export FACEBOOK_USER_TOKEN="your_user_access_token"
```

The User Access Token must include these permissions:

* `pages_show_list`
* `pages_read_engagement`
* `pages_manage_posts`

---

## 1. Verify the User Access Token

Confirm that the token belongs to your Facebook user:

```bash
curl -s \
"https://graph.facebook.com/v25.0/me?access_token=$FACEBOOK_USER_TOKEN"
```

Expected response:

```json
{
  "name": "Your Name",
  "id": "your_user_id"
}
```

---

## 2. Verify Token Permissions

Check that the required permissions were granted:

```bash
curl -s \
"https://graph.facebook.com/v25.0/me/permissions?access_token=$FACEBOOK_USER_TOKEN" | jq
```

Expected:

```json
{
  "permission": "pages_manage_posts",
  "status": "granted"
}
```

Also verify:

* `pages_show_list`
* `pages_read_engagement`

---

## 3. Debug the Token

Verify that the token belongs to your Meta App:

```bash
curl -s \
"https://graph.facebook.com/debug_token?input_token=$FACEBOOK_USER_TOKEN&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}" | jq
```

Expected:

```json
{
  "data": {
    "app_id": "your_app_id",
    "type": "USER",
    "is_valid": true
  }
}
```

---

## 4. Get Your Page ID

The debug response contains the Pages available to the token:

```json
"granular_scopes": [
  {
    "scope": "pages_manage_posts",
    "target_ids": [
      "123456789"
    ]
  }
]
```

Set:

```bash
export FACEBOOK_PAGE_ID="123456789"
```

---

## 5. Verify Page Access

Confirm that Graph API can access the Page:

```bash
curl -s \
"https://graph.facebook.com/v25.0/$FACEBOOK_PAGE_ID?fields=id,name&access_token=$FACEBOOK_USER_TOKEN" | jq
```

Expected:

```json
{
  "id": "123456789",
  "name": "My Business Page"
}
```

---

## 6. Get the Page Access Token

Request the Page Access Token:

```bash
curl -s \
"https://graph.facebook.com/v25.0/$FACEBOOK_PAGE_ID?fields=name,access_token&access_token=$FACEBOOK_USER_TOKEN" | jq
```

Expected:

```json
{
  "name": "My Business Page",
  "access_token": "EAAB..."
}
```

Save it:

```bash
export FACEBOOK_PAGE_ACCESS_TOKEN="EAAB..."
```

The Page Access Token is the token your automation script should use.

---

## 7. Test Publishing a Post

Create a test post:

```bash
curl -X POST \
"https://graph.facebook.com/v25.0/$FACEBOOK_PAGE_ID/feed" \
-d "message=Hello from Graph API" \
-d "access_token=$FACEBOOK_PAGE_ACCESS_TOKEN" | jq
```

Success response:

```json
{
  "id": "123456789_987654321"
}
```

---

## Token Summary

| Token                        | Purpose                     | Used by            |
| ---------------------------- | --------------------------- | ------------------ |
| `FACEBOOK_USER_TOKEN`        | Initial authentication      | Setup only         |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Publish/manage Page content | Automation scripts |

For a personal automation tool, store `FACEBOOK_PAGE_ACCESS_TOKEN` securely and load it from environment variables instead of hardcoding it.

## Common Issues

### `/me/accounts` returns an empty list

With the New Pages Experience, `/me/accounts` may return no pages even when the token has valid Page permissions.

Use the Page ID from `granular_scopes.target_ids` instead.

### "Application has been deleted" from debug_token

Check that:

* `FACEBOOK_APP_ID` matches the App that created the token
* `FACEBOOK_APP_SECRET` belongs to the same App
* The `|` character is quoted or escaped in the URL
