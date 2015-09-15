let net = require('net')
let JsonSocket = require('json-socket')
let path = require('path')
let fs = require('fs')
let mkdirp = require('mkdirp')
let rimraf = require('rimraf')
let request    = require('request')
let tar = require('tar')

let client_dir = path.resolve(path.join('/var/tmp', 'dropbox-client'))
console.log("client dir --" +client_dir)
let tcp_host = 'localhost'
let http_server = 'http://localhost:8000'

//console.log('Initial syncing')
request({url: http_server, headers: { accept: 'application/x-gtar'}}).pipe(tar.Extract({path: client_dir}))



//client socket connection
let socket = new JsonSocket(new net.Socket())

socket.connect(8001, tcp_host)

socket.on('connect', function() {socket.sendMessage({name: ' from client'})

socket.on('message', function(message) {
           //   console.log('message greeting' + message.greeting)
            let loc = path.resolve(path.join(client_dir, message.path))
            console.log('message action: ' + message.action)
            console.log('message path: ' + message.path)
            console.log('message type: ' + message.type)
            console.log('client file loc: ' +  loc)                         
          if(message.action === 'add' || message.action === 'change' ){
            console.log('inside add change ' ) 
            if (message.type === 'dir') {
              console.log('creating dir: ' + loc)
              mkdirp(loc)
            }
            else if (message.type === 'file') {
              console.log('writing file: ' + loc)
              request({url: http_server + message.path}).pipe(fs.createWriteStream(loc))
            }
          }

         if (message.action === 'unlink') {
          console.log('inside delete' ) 
          if (message.type === 'dir') {
            console.log('Deleting Dir: '+ loc)
            rimraf(loc, (err) => {
              console.log('error in deleting folder: ' + err)
            })
            }
            else if (message.type === 'file') {
              console.log('Deleting File: '+ loc)
              fs.unlink(loc, (err) => {
                console.log('error in deleting file: ' + err)
              })
            }
            } 
          })})