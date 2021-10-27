# <span style="text-decoration: underline"> Directory browsing </span>

##### Tags : `url` , `directory` , `browsing` , `path` , `etc/passwd`
##### Server ip : `192.168.1.23 `
____

# <span style="text-decoration: underline">problem</span>
When we go to the `signin` page we go to the **http://192.168.1.23/?page=signin** page. We can see that this url takes a parameter called `page` and the value us `signin`. When we go to the `Survey` page we can see **http://192.168.1.23/?page=survey** and again the parameter `page` and the value this time is `survey`. We can see that the value represent the page that we want to be served.

When we change the value to somethig else, for exemple to `asdasd`, we get an alert saying **`wtf ?`**. Hmm... In this particular web application it is not apparent what is happening but it seems like a middle man is serving us whatever we ask it to serv. We can find this kind of challenge in many [**ctf**](https://ctftime.org/) challenges.

When we ask it to serve `../` (parent directory) it once again shows an alert saying **`Wtf ?`**. When we ask it to serve us `../../` it gives us an allert saying **`Wrong..`**. The answere changed. It seems like we are accessing to the parent directory, or at least it is simulating that. 

# <span style="text-decoration: underline">Solution</span>

Let's try some more parent directory and try to get the `passwd` file.

?> We are trying to get the `passwd` file because generally in `CTF` challenges we try to get this kind of files. In real life we would rather try to get other importent informations.

|Directory| Alert message|
|--|--|
|../etc/passwd| Wtf ?|
|../../etc/passwd| Wrong..|
|../../../etc/passwd| Nope..|
|../../../../etc/passwd|Almost. |
|../../../../../etc/passwd| Still nope.. |
|../../../../../../etc/passwd|Nope.. |
|../../../../../../../etc/passwd|Congratulaton!! The flag is : b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0  |


# How to avoid the problem

This was once a real problem that destroyed many websites. It is extremely importent to restrict access of the web folder. In modern days this problem is easily avoided by putting the servers in containers but in case where we read files from our computer we should **never** go out of the dedicated directory.

# Flag

```text
b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0
```

# Resources