var express = require('express');
var path = require('path');
var serveStatic = require('serve-static')
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+port);

// Create a periodic HTTP GET request which will
// ping the Heroku app and keep it alive
var http = require("http");
setInterval(function() {
  http.get('http://http://ninja-calc.herokuapp.com');
}, 300000); // every 5 minutes (300000)
