# Hidden

- Tags : `brutforce`, `hidden directory`, `robots.txt`
- Server ip : `192.168.0.23 `
- Difficulty : <span style="color : orange">Medium</span>
___


# problem

One of the first place to look for when we are searching for hidden stuffs in a **web application** is [`robots.txt`](https://en.wikipedia.org/wiki/Robots_exclusion_standard). This is a special file that is used to tell [`scrapping`](https://en.wikipedia.org/wiki/Web_scraping) softwares or **search engines** where to go and where not to go in the web site.

For me the server is running on http://192.168.0.23 (it might be different for you). When we go to http://192.168.1.23/robots.txt we get the following contents

```robots.txt
User-agent: *
Disallow: /whatever
Disallow: /.hidden
```

It says that all user agent (any browsers or software) should not go to the following directories

- `/whatever` (http://192.168.0.23/whatever)
- `/.hidden`  (http://192.168.0.23/.hidden)

> For this writeup what interest us is `/.hidden`.

when we visit the path **http://192.168.0.23/.hidden** we can see the following content

![.hidden index page](resources/images/hodden_index_page.png)

When we enter one of the directories from the list we get a similar directory. For exemple for `amcbevgondgcrloowluziypjdh/` we get the following

![hidden/amcbevgondgcrloowluziypjdh/](resources/images/hidden_amcbevgondgcrloowluziypjdh.png)

When we try to enter one of the directories from this list, such as `/.hidden/amcbevgondgcrloowluziypjdh/ccevyakvydrjhsvbnwvestcfeb/`, we get the following

![/.hidden/amcbevgondgcrloowluziypjdh/ccevyakvydrjhsvbnwvestcfeb/](resources/images/hidden_amcbevgondgcrloowluziypjdh_ccevyakvydrjhsvbnwvestcfeb.png)

and when we go inside any of the directories from the this list of directories we get a `README` file. That means there are 3 level of directories and at each level there are in each level there is a `README` file. At each level there are **26** directories and 1 `README` file.

After opening a certain number of `README` files we get the folling sentences in the different `README` files

1. Demande à ton voisin de gauche
2.  Non ce n'est toujours pas bon ...
3.  Demande à ton voisin de droite
4.  Demande à ton voisin du dessous
5.  Tu veux de l'aide ? Moi aussi !
6.  Toujours pas tu vas craquer non ?
7.  Demande à ton voisin du dessus

And they are not the flag... What we can guess is that we the flag is probably in one of the `README` files but we have to find it by opening 1 by one.

# Solution

## Using [`wget`](https://www.gnu.org/software/wget/)
So what we need to do to get the flag is search all the `README` files, but doing it manually will take AGES! That means there is no way we are doing that. A easy way would be to automate the process of searching using programs.

What we can do is try to download the directories using `wget` and then make our computer search for them.

##### Download using `wget`

```bash
wget -r -nH -q –level=0 -E –ignore-length -x -k -p -erobots=off -np -R index.html 'http://192.168.1.23/.hidden/'
```

|Option|Description|
|--|--|
|`-r` | Recursively |
|`-nH` | not saving files to hostname folder  |
|`-q` | Quiet / Silent|
|`-level` | Specify recursion maximum depth level (0 for no limit), very important |
|`-E` | append “.html” extension to every document declared as “application/html“. Useful when you deal with dirs (that are not dirs but index.html files) |
|`-ignore-length` | Ignore “Content-length” http headers, sometimes useful when dealing with bugged CGI programs |
|`-x` | Force dirs, create an hierarchy of directories even if one would not been created otherwise |
|`-k` | here’s one of the most useful options, it converts remote links to local for best viewing |
|`-p` | download all the files that are necessary for proper display of the page |
|`-erobots` | turn off http robots.txt usage |
|`-np` | not going to upper directories, like ccc/… |
|`-R` | excluding index.html files  |

This command downloads the directory `.hidden` on our computer under the folder `.hidden` and in that directory we can find the `README` files and all the other directories.
Once we have downloaded all we need to do is just find all the `README` files and then **read** them to get the flag!

We can find all the `README` files using the command `find`

```bash
find . -type f -name 'README'
```

and this gives us all the `README` files with the whole path. Once we have all the `README`s all we need to do is feed them to `grep` so that `grep` can spit out what we want. So the problem is that we don't know in what form the `flag` is written as. What we can guess is that in all the normal `READFILES` there are a lot of **spaces** and at `1` **new line** and we can tell grep to ignor files with those characters using the flag **`-v`** as such

```bash
xargs grep -v ' '
```

> [xags](https://www.man7.org/linux/man-pages/man1/xargs.1.html) is used to get all the standard input and use them as the parameter of the next program

The full command to find all the `README` files and pass them to grep looks as following

```bash
find . -type f -name 'README' | xargs grep -v ' '
```


The full command to download the whole directory and get the `flag` is the following

```bash
wget -r -nH -q –level=0 -E –ignore-length -x -k -p -erobots=off -np -R index.html 'http://192.168.1.23/.hidden/'; cd .hidden; find . -type f -name 'README' | xargs grep -v ' '
```

and when we execute that command we get the following result

```bash
./whtccjokayshttvxycsvykxcfm/igeemtxnvexvxezqwntmzjltkt/lmpanswobhwcozdqixbowvbrhw/README:99dde1d35d1fdd283924d84e6d9f1d820
```

## By scrapping the site programmaticaly

We can easily create a script that can scrap the `.hidden` webpage, read the contents and search each sub directory recursivly then read the `README` files.

The following program uses the following `node modules`
- [node-html-parser](https://github.com/taoqf/node-html-parser)
- [node-fetch](https://github.com/node-fetch/node-fetch)

You can also find the entire program in [github](https://github.com/suddin0/darkly/tree/develop/hidden/brutforce_hidden_directory)

```js
const {parse} = require('node-html-parser');
const fetch = require('node-fetch');


const HOST = process.env.HOST || '192.168.1.23'
const PORT = process.env.PORT || 80
const ROOT_PATH = process.env.ROOT_PATH || '/.hidden/'
const BASE_URL = 'http://' + HOST + ':' + PORT + ROOT_PATH

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}

/**
 * 
 * @param {String} url The url to GET
 * @returns Html Page as String
 * 
 * The following function try to Fetch (GET) the url provided in the parameter
 * and return the content of the HTML page as String
 */

async function fetchUrl(url) {
	try {
		const response = await fetch(url)
		const text = await response.text()
		return(text)
	  } catch (error) {
		console.error(`[-] Error occured while GETting datata from ${url}` , error);
		process.exit(1)
	  }
}

/**
 * 
 * @param {String} data Html page
 * @returns Array of Links in form of String
 * 
 * This function takes an `Html` page as `String` and parse all the
 * links inside it and returns the links as `array` of Strings
 */
function getAllLinks(data) {
	if(!data) {return null}

	const parsedHtmlBody = parse(data);
	try {
		let parsedPre = parse(parsedHtmlBody.getElementsByTagName('pre')[0].childNodes.toString())
		let linkList = parsedPre.getElementsByTagName('a').filter(elem => elem.text != '../');
		linkList = linkList.map((val, key) => val.text)
		return(linkList)
	} catch (err) {
		console.warn("[*] No `pre` element found for ", data);
		return (null)
	}
}

/**
 * 
 * @param {Array} linkList List of all the Links
 * @param {String} baseUrl Url used to fetch data from
 * 
 * This is a recursive function that reads all the links one by one and call the
 * `fetchUrl` on it. With the fetched data it calls the `getAllLinks` and it usesd the
 * Array of links to call it self. This functions read all the links until there are
 * no other links to read
 */
async function recursiveSearch(linkList, baseUrl) {
	/**
	 * If for some reason the `linkList` ware not given
	 * then we get it ourself using the `BASE_URL`
	 */
	if(!linkList){
		const d = await fetchUrl(BASE_URL)
		linkList = getAllLinks(d);
		
	}
		
	for(let link of linkList) {
		/**
		 * If the file is `README` then read the content and `continue` without recursing on it.
		 * We ignore the following sentences
		 * - Demande à ton voisin de gauche  
		 * - Non ce n'est toujours pas bon ...
		 * - Demande à ton voisin de droite  
		 * - Demande à ton voisin du dessous 
		 * - Tu veux de l'aide ? Moi aussi !  
		 * - Toujours pas tu vas craquer non ?
		 * - Demande à ton voisin du dessus  
		 * 
		 * We ignore them because they are not importent to us
		 */
		if(link === 'README') {
			// console.log(baseUrl);
			rm = await fetchUrl(baseUrl + 'README')
			if(
				   rm !== 'Demande à ton voisin de gauche  \n'
				&& rm !== "Non ce n'est toujours pas bon ...\n"
				&& rm !== "Demande à ton voisin de droite  \n"
				&& rm !== "Demande à ton voisin du dessous \n"
				&& rm !== "Tu veux de l'aide ? Moi aussi !  \n"
				&& rm !== "Toujours pas tu vas craquer non ?\n"
				&& rm !== "Demande à ton voisin du dessus  \n"
				) {
					console.log("URL: ", baseUrl + 'README');
					console.log("-", rm);
				}
				
			continue
		}

		/**
		 * This is the url used as the base url for the `child` page (link)
		 */
		let nextUrl = baseUrl + link
		
		// 01. Fetch data
		let data = undefined
		try{
			/**
			 * We wait for 200 ms because if we don't the server
			 * shut us down and stop us from scaping the datas
			 */
			await sleep(200)
			data = await fetchUrl(nextUrl)
		} catch (err) {
			console.error("[-] Error occured while fetching data from : ", nextUrl, err);
			process.exit(1)
		}
		if(!data) {
			console.error("[-] Data was not fetched for :", nextUrl)
			process.exit(1)
		}
		// 02. Get link list
		const links = getAllLinks(data);
		// 03. call recursiveSearch
		if(links)
		{
			recursiveSearch(links, nextUrl)
		}
	}
}

async function main() {
	recursiveSearch(undefined, BASE_URL)
}

main();

```

# How to avoid the problem
A normal server generelly serves everything unles it is told not to serve. The are special files that exists restrict access to special files and directory and that is called [`.htaccess`](https://en.wikipedia.org/wiki/.htaccess) all though in modern servers we do not necesserily use this files bit in servers like `Apachy` and many other we do and their role is to protect access to special places and we should use them pro prodect better our directories.


# Flag

```text
99dde1d35d1fdd283924d84e6d9f1d820
```

# Resources
- [StackOverflow : Download directories using `wget`](https://stackoverflow.com/a/26269730/4440716)
- [WGet and Downloading an entire remote directory](https://www.linux.com/training-tutorials/wget-and-downloading-entire-remote-directory/)