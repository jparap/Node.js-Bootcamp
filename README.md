# Node.js-Bootcamp

This is a Proxy Server for Node.js submitted as the pre-work requirement for CodePath.

To run the Proxy Server:

Change the current direcory to proxy-server

$ cd proxy-server

$ babel-node index.js
server listening to port8000
Usage - Browser: http://proxyServerDomainName:8000/?url=urlOfWebSite
Usage - Commandline: curl -v -X POST http://proxyServerDomainName:8000/?url=urlOfWebSite
e.g - Browser: http://localhost:8000/?url=http://www.walmart.com
e.g - Commandline: curl -v -X POST http://127.0.0.1:8000/?url=http://www.walmart.com

To access sites using browser: 
http://proxyServerDomainName:8000/?url=urlOfWebSite
e.g. : http://localhost:8000/?url=http://www.walmart.com

To access sites using commandline: 
curl -v -X POST http://proxyServerDomainName:8000/?url=urlOfWebSite
e.g. : curl -v -X POST http://127.0.0.1:8000/?url=http://www.walmart.com
