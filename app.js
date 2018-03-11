var http = require('http');
var express = require('express');
var Server = require('socket.io');
var path = require('path');
var app = express();


var server = http.createServer(app);

var ioServer = Server(server);

server.listen(3000,function(){
	console.log('server running');
});

/////
app.use('/',express.static(path.join(__dirname)));


var userNames = [];
ioServer.on('connect',function (socket) {
	console.log('socket created');
	socket.on('addUser',function(data,callback){
		if(userNames.indexOf(data) < 0) {
			callback(true);
			userNames.push(data);
			socket.userName = data;
			ioServer.emit('showAllUsers',userNames);
		} else{
			callback(false);	
		}
	});

	socket.on('disconnect',function(){
		userNames.splice(userNames.indexOf(socket.userName),1);
		ioServer.emit('showAllUsers',userNames);
	});

	socket.on('message',function(data){
		var tmpObj = {usr: socket.userName, msg: data};
		ioServer.send(tmpObj);
	});
});

