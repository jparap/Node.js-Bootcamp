let net = require('net')
let JsonSocket = require('json-socket')
//let http = require('http');

let socket = new JsonSocket(new net.Socket())

socket.connect(8001, '127.0.0.1')

socket.on('connect', function(){
	socket.on('message', function(message){
		console.log("the result is:  " + message.action +' ' +message.path +' '+ message.type )
//      getContents(message.path)
	})
})

/* function getContents(filePath) {

    return http.get({
        host: '127.0.0.1',
        path: filePath
    }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
        console.log(body);
            });
        });
 //   });
 */

