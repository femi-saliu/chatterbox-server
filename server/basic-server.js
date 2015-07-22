/* Import node's http module: */
var http = require("http");
var handler = require('./request-handler.js');

var port = 3000;

var ip = "127.0.0.1";

var server = http.createServer(handler.requestHandler);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

