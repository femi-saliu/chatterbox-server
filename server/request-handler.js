var _ = require('underscore');
var url = require('url');
var fs = require('fs');
var statusCode;
var parsedUrl;
var dataHolder;
var objectId = 1;

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var updateJSONData = function(jsonObject){
  jsonObject.objectId = objectId++;
  fs.readFile('./data.json', function(error, data){
    if (error) return console.log(error);
    dataHolder = JSON.parse(data);
    dataHolder.results.unshift(jsonObject);
    fs.writeFile('./data.json', JSON.stringify(dataHolder), function(error){
      if (error) return console.log(error);
      console.log('Write complete.');
    });
  });
};

var handleResponse = function(response, header, statusCode, data){
  response.writeHead(statusCode, header);
  response.end(data);
};

var methods = {
  'GET': function(request, response){
    parsedUrl = url.parse(request.url);
    
    if (parsedUrl.pathname === '/classes/messages'){
      response.writeHead(statusCode, headers);
      fs.readFile('./data.json', function(error, data){
        if (error) return console.log(error);
        handleResponse(response, headers, 200, JSON.stringify(JSON.parse(data)));
      });
    } else if (parsedUrl.pathname === '/classes/room1'){
      response.writeHead(statusCode, headers);
      response.end();
    } else {
      handleResponse(response, headers, 404);
    }
  },
  'POST': function(request, response){
    statusCode = 201;
    response.writeHead(statusCode, headers);
    var data = "";

    request.on('data', function(chunk){
      data += chunk;
      console.log('Data: ', chunk);
      // callback(JSON.parse(data));
    });

    request.on('end', function(){
      console.log('raw data', data);
      console.log('parsed', JSON.parse(data));
      updateJSONData(JSON.parse(data));
      fs.readFile('./data.json', function(error, data){
        if (error) return console.log(error);
        response.end(JSON.stringify(data));
      });
    });
  },
  'PUT': function(request, response){},
  'DELETE': function(request, response){},
  'OPTIONS': function(request, response){
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  }
};

exports.requestHandler = function(request, response) { 
  console.log("Serving request type " + request.method + " for url " + request.url);
  methods[request.method](request,response);
};