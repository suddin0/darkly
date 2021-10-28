# <span style="text-decoration: underline">Recover</span>

- Tags : `html`, `source code`, `hidden`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : green">Easy</span>
___


## <span style="text-decoration: underline">problem</span>
In the sign in page when we get the option **`I forgot my password`** Which bring us to the following page (http://192.168.1.23/?page=recover)
![recover password index page](resources/images/recover_password_page_index.png)

And when we click the `SUBMIT` button we get the following result
![recover page submited](resources/images/recover_password_page_submit.png)

It seems like noting happend...
When we see the source code of the `recover` page we see the following `html` block near the `SUBMIT` button (inside the `form`).

```html
<form action="#" method="POST">
	<input type="hidden" name="mail" value="webmaster@borntosec.com" maxlength="15">
	<input type="submit" name="Submit" value= "Submit">
</form>
```

We can see that there is an `input` that is `hidden`, that contains the value `webmaster@borntosec.com`. When we change the `type` from **hidden** to **visible** we get the following result
![recover page visible input field](resources/images/recover_password_page_visible_field.png)


## <span style="text-decoration: underline">Solution</span>

### Changing the value of the input field
One easiy way to solve this problem is just making the `input` field `visible` and changing it's value from  `webmaster@borntosec.com` to anything else (even no value at all) and clicking the submit button. it then brings us the following page
![recover page flag](resources/images/recover_password_page_flag.png)

### Using [`Curl`](https://curl.se/)

Ofcorse the same request could be sent using `Curl` from our terminal and it would look like this
```bash
$ curl -s -d 'mail=&Submit=Submit' -X POST http://192.168.1.23/\?page\=recover  | grep flag

<center><h2 style="margin-top:50px;"> The flag is : 1d4855f7337c0c14b6f44946872c4eb33853f40b2d54393fbe94f49f1e19bbb0</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center>
```

# How to avoid the problem
We could avoid this kind of problem easily by not putting any hidden element in our source code as it can be modified easily. Instead what we could do is check some specific elements in the backend to determin who sent the request or even set an unique ID

# Flag

```text
1d4855f7337c0c14b6f44946872c4eb33853f40b2d54393fbe94f49f1e19bbb0
```
