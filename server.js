var express = require('express');
var path = require('path');
var serveStatic = require('serve-static')
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Server started on port "' + port + '".');

// Create a periodic HTTP GET request which will
// ping the Heroku app and keep it alive
console.log('Setting up 5min ping...')
var http = require("http");
setInterval(function() {
  console.log('Pinging http://ninja-calc.mbedded.ninja/.');
  http.get('http://ninja-calc.mbedded.ninja/');
}, 300000); // every 5 minutes (300000)

console.log('server.js finished.')
