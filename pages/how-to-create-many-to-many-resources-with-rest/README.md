How to Create Many-to-Many Resources with REST
==============================================

Imagine a classic Many-to-Many relationship where a _User_ can subscribe to many _Groups_ and a _Group_ can have many subscribers. During subscription we need to indicate what is the _*role*_ for that _User_. Possible _*roles*_ are: owner, collaborator or member.

In relational land, this is a classic _User_ Many-to-Tany _Group_ which results in a join table plus a field to represent the _*role*_ of the _User_ in the _Group_.

In REST land, we could represent it as a relationship resource:

Create a User
```
--- Request ---
POST /users
{name: "Jack"}
--- Response ---
{userId: 11, name: "Jack"}
```

Create a Group
```
--- Request ---
POST /groups
{description: "Java Programming Language"}
--- Response ---
{groupId: 21, description: "Java Programming Language"}
```

Now let's subscribe the _User_ "Jack" to the _Group_ "Java Programming Language" as "collaborator".

```
--- Request ---
POST /subscriptions
{userId: 11, groupId: 21, role: "collaborator"}
--- Response ---
{subscriptionId: 31, userId: 11, groupId: 21, role: "collaborator"}
```

Get all "Jack"'s (userId=11) subscriptions
```
--- Request ---
GET /subscriptions?userId=11
--- Response ---
[ {subscriptionId: 31, userId: 11, groupId: 21, role: "collaborator"} ]
```

Delete the subscription
```
--- Request ---
DELETE /subscriptions/31
--- Response ---
Status 200 OK
```

Note: subscriptions could be named as `users-to-groups` or anything else you can think of. I just find subscriptions more meaningful for this scenario.