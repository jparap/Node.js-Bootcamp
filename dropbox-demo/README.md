
Time spent: `7`

### Features

#### Required

- [x] Walkthrough Gif embedded in README
- [x] README `Time spent:` includes the number of hours spent on the assignment
- [x] Client can make GET requests to get file or directory contents
- [x] Client can download a directory
- [x] Client can make HEAD request to get just the GET headers 
- [x] Client can make PUT requests to create new directories and files with content
- [x] Client can make POST requests to update the contents of a file
- [x] Client can make DELETE requests to delete files and folders
- [x] Server will serve from `--dir` or cwd as root
- [x] Server will sync `HTTP` modifications over TCP to the Client
- [x] Server will sync watched file modifications (e.g., `fs.watch`) over TCP to the Client

### Optional

- [ ] Client supports multiple connected clients
- [ ] Client does not need to make additional `GET` request on `"write"` update
- [ ] Client and User will be redirected from HTTP to HTTPS
- [ ] Client will sync back to Server over TCP
- [ ] Client will preserve a 'Conflict' file when pushed changes preceeding local edits
- [ ] Client can stream and scrub video files (e.g., on iOS)
- [ ] Client can create a directory with an archive
- [ ] User can connect to the server using an FTP client


### Walkthrough
  Note: To start server and client, need to execute the following commands:
  
   Walkthrough:  https://github.com/jparap/Node.js-Bootcamp/issues/3
  
    To start the server:	npm start
    
    To start the cleint:	npm run client
    
    To add / put a file:	curl -v http://127.0.0.1:8000/tesfile1.txt -X PUT -d "tesfile test 1"
    
    To get files:	curl -v http://127.0.0.1:8000/ -X GET
