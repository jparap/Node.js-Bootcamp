let net = require('net')
let JsonSocket = require('json-socket')
let path = require('path')
let fs = require('fs')
let chokidar   = require('chokidar')
let request    = require('request')

let client_dir = path.resolve(path.join(process.cwd(), 'client'))
let http_server = 'http://127.0.0.1:8000'

console.log("client_dir dir  --" +client_dir)

//client socket connection
let socket = new JsonSocket(new net.Socket())

socket.connect(8001, `127.0.0.1`)

socket.on('connect', function() { 
     socket.sendMessage({name: ' from client'})
     socket.on('message', function(message) {
           //   console.log('message greeting' + message.greeting)
            let loc = path.join(client_dir, message.path)
            console.log('message action' + message.action)
            console.log('http://localhost:8000' + message.path)
            console.log('client file loc' +  loc)                         
          if(message.action === 'create' 
            || message.action === 'update' ){
            console.log('writing file ' + loc)
         request({url: http_server + message.path}).pipe(fs.createWriteStream(loc))
          }
         if (message.action === 'delete') {
           console.log(`deleting file  ${loc}`)
          //  await fs.promise.unlink(loc)
    }
    
})})