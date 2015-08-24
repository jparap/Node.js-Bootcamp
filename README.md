# Node.js-Bootcamp
# Pre Work

To run the Proxy Server:

$ babel-node index.js
server listening to port8000
Usage - Browser: http://proxyServerDomainName:8000/?url=urlOfWebSite
Usage - Commandline: curl -v -X POST http://proxyServerDomainName:8000/?url=urlOfWebSite
e.g - Browser: http://localhost:8000/?url=http://www.walmart.com
e.g - Commandline: curl -v -X POST http://127.0.0.1:8000/?url=http://www.walmart.com


Open  a browser window and use the url given below to access a site using the proxy server

http://localhost:8000/?url=http://www.walmart.com

To access the site through the proxy server using command line, use the follwowing

curl -v -X POST http://127.0.0.1:8000/?url=http://www.walmart.com