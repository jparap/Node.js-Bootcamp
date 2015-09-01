let net = require('net')
let jsonSocket = require('json-socket')
let chokidar = require('chokidar')

let server = net.createServer();
server.listen(8001);

server.on('connection', function(socket) {
    socket = new jsonSocket(socket); 
	watchFiles(socket);
});

function watchFiles(socket){
	let resObj = {}
	let watcher = chokidar.watch('/Users/jparap1/Projects/node/assignments/dropbox-demo', {
		ignored: /[\/\\]\./,
		persistent: true
	});

	watcher
  	  .on('add', function(path) {socket.sendEndMessage({action: 'add', path: path, type: 'file' }); })
	  .on('addDir', function(path) { console.log('Directory', path, 'has been added'); })
	  .on('change', function(path) {socket.sendEndMessage({action: 'change', path: path, type: 'file' }); 	  console.log('File', path, ' changed');})
	  .on('delete', function(path) {socket.sendEndMessage({action: 'delete', path: path, type: 'file' }); console.log('File', path, ' deleted');})	
	  .on('unlink', function(path) { console.log('File', path, 'has been removed'); })
	  .on('unlinkDir', function(path) { console.log('Directory', path, 'has been removed'); })
	  .on('ready', function() { console.log('Initial scan complete. Ready for changes.'); })
}
