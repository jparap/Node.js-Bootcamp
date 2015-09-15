let express = require('express')
let fs = require('fs')
let path = require('path')
let morgan = require('morgan')
let nodeify = require('bluebird-nodeify')
let mime = require('mime-types')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
//let bluebird = require('bluebird')
//bluebird.longStackTraces()
//require('longjohn')
let net = require('net')
let JsonSocket = require('json-socket')
let archiver = require('archiver')
let chokidar = require('chokidar');

require('songbird')

//define constants
const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.port || 8000
const ROOT_DIR = path.resolve(process.cwd())

// setting up the  app
let app = express()

// adding the middleware 
app.use(morgan('dev'))

//HTTP Server
app.listen(PORT,() => console.log(`HTTP Server Listening @ localhost:${PORT}`))

// HEADERS
app.head('*', setFileMeta, sendHeaders,(req, res) => res.end())

// GET
/* app.get('*', setFileMeta, sendHeaders,(req, res) => {
  if (!req.stat) return res.send(400, 'Invalid Path')

  if (res.body) {
    res.json(res.body)
    return
  }
  fs.createReadStream(req.filePath).pipe(res)
})
*/

app.get('*', setFileMeta, sendHeaders, (req, res) => {
    console.log(req.headers.accept)
    if (!req.stat) return res.send(400, 'Invalid Path')

    if (res.body) {

        if (req.accepts('application/x-gtar')) {
            let archive = archiver('tar')
            archive.pipe(res);
            archive.bulk([
                { expand: true, cwd: req.filePath, src: ['**']}
            ])
            archive.finalize()

            archive.on('close', function() {
                res.setHeader("Content-Length", archive.pointer())
            });

            res.setHeader("Content-Type", 'application/x-gtar')

            return
        } 

        if (req.accepts(['*/*', 'application/json'])) {
            res.setHeader("Content-Length", res.body.length)
            res.json(res.body)
            return
        }
    }

    fs.createReadStream(req.filePath).pipe(res)
})


// DELETE
app.delete('*', setFileMeta,(req, res, next) => {
  async() => {
    if (!req.stat) return res.send(400, 'Invalid Path')

    if (req.stat.isDirectory()) {
      await rimraf.promise(req.filePath)
    } else await fs.promise.unlink(req.filePath)
    res.end()
  } ().catch(next)
})

// PUT
app.put('*', setFileMeta, setDirDetails,(req, res, next) => {
  async() => {
	console.log(req.dirPath)
	req.action = 'add'
	console.log(req.isDir)
    if (req.stat) return res.send(405, 'File Exists')
    await mkdirp.promise(req.dirPath)
    if (!req.isDir) req.pipe(fs.createWriteStream(req.filePath))
	//sendtoClient(req,res)
    res.status(200).send('File  added Successfully')
    res.end()
  } ().catch(next)
})

// POST
app.post('*', setFileMeta, setDirDetails,(req, res, next) => {
  async() => {
    if (!req.stat) return res.send(405, 'File does not exist')
    if (req.isDir) return res.send(405, 'Path is a directory')

    await fs.promise.truncate(req.filePath, 0)
    if (!req.isDir) req.pipe(fs.createWriteStream(req.filePath))
    res.end()
  } ().catch(next)
})

//setDirDetails
function setDirDetails(req, res, next) {
  let filePath = req.filePath
  let endsWithSlash = filePath.charAt(filePath.length - 1) === path.sep
  let hasExt = path.extname(filePath) !== ''
  req.isDir = endsWithSlash || !hasExt
  req.dirPath = req.isDir ? filePath : path.dirname(filePath)
  next()
}
//setFileMeta
function setFileMeta(req, res, next) {
  req.filePath = path.resolve(path.join(ROOT_DIR, req.url))
  if (req.filePath.indexOf(ROOT_DIR) !== 0) {
    res.send(400, 'Invalid Path')
    return
  }
  fs.promise.stat(req.filePath)
    .then(stat => req.stat = stat,() => req.stat = null)
    .nodeify(next)
}

//sendHeaders
function sendHeaders(req, res, next) {
  nodeify(async() => {
    if(req.stat.isDirectory()) {
      let files = await fs.promise.readdir(req.filePath)
      res.body = JSON.stringify(files)
      res.setHeader('Content-Length', res.body.length)
      res.setHeader('Content-Type', 'application/json')
      return
    }
    res.setHeader('Content-Length', req.stat.size)
    let contentType = mime.contentType(path.extname(req.filePath))
    res.setHeader('Content-Type', contentType)
  }(), next)
}

//TCP Server
let tcpSockets=[]
let tcpserver = net.createServer()
tcpserver.listen(8001, () => console.log('TCP Server Listening @ localhost:8001'))
tcpserver.on('connection', (socket) => {
 socket = new JsonSocket(socket)
 tcpSockets.push(socket)
 socket.on('message', function(message) {
  socket.sendMessage({greeting: 'hello ' + message.name})
 })
  console.info(`tcp Connection from ${socket.remoteAddress}:${socket.remotePort}`)
})

//Send message to client
function sendtoClient(req, res){

	console.log('Number of clients connected:' + tcpSockets.length)

	for (let clientSocket of tcpSockets) {
		clientSocket.sendMessage({action:req.action,path:req.url,type:req.isDir?'dir':'file'})
	}
}

function sendChangetoClient(action, path, type){

  console.log('Number of clients connected:' + tcpSockets.length)

  for (let clientSocket of tcpSockets) {
    clientSocket.sendMessage({action:action,path:path,type:type})
  }
}

function sendChangetoClient(action, path, type){

  console.log('Number of clients connected:' + tcpSockets.length)

  for (let clientSocket of tcpSockets) {
    clientSocket.sendMessage({action:action,path:path,type:type})
  }
}


//TCP server to watch and notify the changes.
let watcher = chokidar.watch(ROOT_DIR, {
  ignored: /[\/\\]\./,
  persistent: true
})
watcher
  .on('add', function(path) { 
      console.log('File', path, ' added') 
      sendChangetoClient('add', path.replace(ROOT_DIR, ""), 'file') 
    })
  .on('change', function(path) 
    { console.log('File', path, ' changed') 
      sendChangetoClient('change', path.replace(ROOT_DIR, ""), 'file')  
    })
  .on('unlink', function(path) 
    { console.log('File', path, ' removed') 
      sendChangetoClient('unlink', path.replace(ROOT_DIR, ""), 'file' )  
    })
  .on('addDir', function(path) 
    { console.log('Directory', path, ' added') 
      sendChangetoClient('add', path.replace(ROOT_DIR, ""), 'dir')  
    })
  .on('unlinkDir', function(path) 
    { console.log('Directory', path, ' removed') 
      sendChangetoClient('unlink', path.replace(ROOT_DIR, ""), 'dir' ) 
    })
  .on('ready', function() 
    { console.log('Initial scan complete. Ready for changes.') 
  })



