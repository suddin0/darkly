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
