# <span style="text-decoration: underline"> ©opyright </span>

- Tags : `Comments` , `Http-Header` , `Referer` , `User-Agent` , `curl`, `spoof`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : green">Easy</span>
___


# <span style="text-decoration: underline">problem</span>

On the bottom of our website we can see a copyright message that says `© BornToSec`. This is a link to **http://192.168.1.23/index.php?page=e43ad1fdc54babe674da7c7b8f0127bde61de3fbe01def7d00f151c2fcca6d1c**, which in itself looks like a *flag*. There is nothing in partucular in this website to see.

![copyright index](/.resources/images/copytight_page_index.png)

In the `source code` there is a big comment and in the biddle of the comment we see the following message

```html
...
<!--You must cumming from : "https://www.nsa.gov/" to go to the next step-->
...
<!--Let's use this browser : "ft_bornToSec". It will help you a lot.-->
```

From this comment we can guess that
- we need to be coming to this site from (redirected from **ro** [refered](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) from) `https://www.nsa.gov/`
- Our browser should be `ft_bornToSec`. A program knows what browser a user uses by the header element [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)




# <span style="text-decoration: underline">Solution</span>

## From the browser

In a normal browser we can not control the `Http-header` so that we send custom [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) to say from we came to this site nor can we set a custom [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) to say what kind of software we are. For this kind of things there exists many `extentions` for different browser.

For this solution i will be using [simple-modify-headers](https://addons.mozilla.org/fr/firefox/addon/simple-modify-header/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) on **firefox**

We open the **simple-modify-headers** parameter options and we set what we need to do the challenge
![simple-modify-headers menu](/.resources/images/copyright_header_extention.png)

Once everything is set we go to our `copyright` url (http://192.168.1.23/index.php?page=e43ad1fdc54babe674da7c7b8f0127bde61de3fbe01def7d00f151c2fcca6d1c) and we reload the page so that our newly set `http-header` option takes effect and voila!

![copytight flag](/.resources/images/copyright_page_flag.png)

## Using [`Curl`](https://curl.se/)

Contrary to using the browser, with curl it is way easier to do this kind of things, because it is built to do things as such.

```bash
$ curl -s -e "https://www.nsa.gov/" -A "ft_bornToSec" "http://192.168.1.23/index.php?page=e43ad1fdc54babe674da7c7b8f0127bde61de3fbe01def7d00f151c2fcca6d1c" | grep flag

<center><h2 style="margin-top:50px;"> The flag is : f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center> <audio id="best_music_ever" src="audio/music.mp3"preload="true" loop="loop" autoplay="autoplay">
```

|Option|Description|
|--|-- |
|`-s` | Quiet mode|
|`-e`| Referer |
|`-A`| User agent|

# How to avoid the problem
We can avoid this kind of problemes by not depending on the `Http-header` elements to show **restricted** infomation.


# Flag

```text
f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188
```