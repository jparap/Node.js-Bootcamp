let http = require('http')
let url = require('url')
let request = require('request')

http.createServer(getHttpResponse).listen(8000)
console.log ("server listening to port" + 8000)
console.log ("Usage - Browser: http://proxyServerDomainName:8000/?url=urlOfWebSite")
console.log ("Usage - Commandline: curl -v -X POST http://proxyServerDomainName:8000/?url=urlOfWebSite")
console.log ("e.g - Browser: http://localhost:8000/?url=http://www.walmart.com")
console.log ("e.g - Commandline: curl -v -X POST http://127.0.0.1:8000/?url=http://www.walmart.com")

function getHttpResponse(req, res) {
	let query = url.parse(req.url, true).query
	let verifiedUrl=query.url
	if(req.headers['x-destination-url']){
		verifiedUrl=req.headers['x-destination-url']
	}	
	let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
							  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
							  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
							  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
							  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
							  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	if(!pattern.test(verifiedUrl)) {
	  console.log ("not a valid url" + verifiedUrl)
	  res.end("no url found.  usage is http://proxyServerDomainName:8000/?url=urlOfWebSite")
	}else{   
       	if (verifiedUrl) {
			request({
				url: verifiedUrl
			}).on('error', function(e) {
					//res.end(e);
					res.end("no url found")
				}).pipe(res)
		}
		else {
			res.end("no url found.  usage is http://proxyServerDomainName:8000/?url=urlOfWebSite")
		}
	}
}
