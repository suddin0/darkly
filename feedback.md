# <span style="text-decoration: underline"> FeedBack XSS</span>

- Tags : `xss`, `raw data`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : green">Easy</span>

___


# <span style="text-decoration: underline">problem</span>

From the homepage when we click on the button `FEEDBACK` we are brought to http://192.168.1.23/?page=feedback. In this page we are presented with a `form` with **2** `inputs`

- Name : Accepts 10 character
- Message : Accepts 50 character

and a `submit` button called `SIGN GUESTBOOK`.

When we fill the `form` and click on the `submit` button, our input is shown on the bottom of the `form`. When we write a `html` tag on both `name` and `message` field

- Name : `<h1>A</h1>`
- Message : `<h1>AAAAAAAAAAAA</h1>`

and submit it we can see that the `name` got the `html` propery of `h1` but not the message. When we try the `<script>` tag we can see that it has been striped out and the `name` is empty.


# <span style="text-decoration: underline">Solution</span>

For this challenge all we have to do is just open a **stript** tag without closing

```html
<script
```

This will prevent the site from deleting our tag as it is not a complete tag and this tag will still create problem because it is still treated as a valid `html` syntax.

When we submit `<script` we get the **`flag`** as the result.

# <span style="text-decoration: underline">How to avoid the problem</span>

To prevent this problem we should **never** show directly user inputs. Any user inputs should be shown in tags like `<code>` and `<pre>` and if possible treat them befor showing.


# <span style="text-decoration: underline">Flag</span>

```text
0fbb54bbf7d099713ca4be297e1bc7da0173d8b3c21c1811b916a3a86652724e
```
