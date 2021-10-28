# <span style="text-decoration: underline"> NSA Image XSS </span>

- Tags : `xss` , `include`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : orange">Medium</span>
___


# <span style="text-decoration: underline">problem</span>

From the middle section of our home page (prism) one of the three images (the last nsa image) is clickable and brings us to http://192.168.1.23/?page=media&src=nsa. There is nothing in particular in that page nor in the source code that we can see. After a little bit of messing arround with the `url` we find out that when we replace the `value` of **`src`** by `../` It shows us the parent page in some kind of `iframe`. but we still don't get the flag... After a little bit of messing arround we can find out that when we replace the `value` of **`src`** by an image from the same server we can see the image in teh biddle of the page.

here i replaced **`src`** by the `42` logo path  (http://192.168.1.23/?page=media&src=/images/42.jpeg)

When we inspect the image we can see the following `html`

```html
<td style="vertical-align:middle;">
	<object data="/images/42.jpeg">
	</object>
</td>
```

We can see in the `html` that the value of **`src`** field is beeing used as the image source

We get the following information from [www.w3schools.com](https://www.w3schools.com/TAgs/tag_object.asp)

> The `<object>` tag defines a container for an external resource. The external resource can be a web page, a picture, a media player, or a plug-in application.


Sadly i wasn't able to make it show contents from external links (like other web pages or videos etc...).

# <span style="text-decoration: underline">Solution</span>

Even though we can not show external content what we can try is to make it show internal content and along try do make it execute something.

We know it can show media content such as images and video. In the `<img>` tag, one way of showing images are using **base64** datas what if we try that ?

Sadly most small visible images are to bif dora url text limit. Maybe instead of trying to display `image` **data**, we can directly try to display `html` data.

> [Here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) we can learn more about `data` attribute and how we can display different type of data using this attribute.

Thaks to this article, it seems that all we need to do is put `data:text/html,` followd by our data.

so when we try 

```html
data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E
```

In fect, we can see `Hello world`!!

and when we try

```html
data:text/html,<script>alert("test")<%2Fscript>
```

our script get's executed and we get an alert!! But still no flag...

What if wy try the script tag in base64 (we don't have a lot of optionsleft at this test) ?

```html
data:text/html;base64,PHNjcmlwdD5hbGVydCh0ZXN0KTwvc2NyaXB0Pg==
```

Yes it gives us the flag...

> I'm supposing this challenge was meant to be a `XSS` exploit vulnerability, but i was able to execute the `js` script and we didn't got the flag. This is clearly a mistake of the people behind this project.


# How to avoid the problem

To avoid this problem the developper should not use user input as `object` tag's `data` in the firt place and use a predefined value.


# Flag

```text
928d819fc19405ae09921a2b71227bd9aba106f9d2d37ac412e9e5a750f1506d
```

# Resources

- [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [HTML `<object>` Tag](https://www.w3schools.com/TAgs/tag_object.asp)