var express = require('express');
var app = express();

app.use( '/assets', express.static(__dirname + '/assets') );
app.use( '/css', express.static(__dirname + '/css') );
app.use( '/build', express.static(__dirname + '/build') );
app.use( '/scripts', express.static(__dirname + '/scripts') );
app.use( '/lib', express.static(__dirname + '/lib') );

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.dev.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
