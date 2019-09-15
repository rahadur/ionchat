var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);


var socket = require('./socket');

var PORT = process.env.NODE_PORT || '3000';
var IP   = process.env.NODE_IP   || '0.0.0.0';


// Setup static folder
app.use("/storage", express.static(__dirname + '/storage'));


// Start Socket.io
socket(io);



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



server.listen(PORT, IP, function(err) {
    if(err) console.log(err);
    console.log(`Server start listening at ${IP}:${PORT}`);
});