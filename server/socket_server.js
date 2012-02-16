var io = require('socket.io').listen(8000);

io.sockets.on('connection', function(socket) {
    console.log("connection");

    socket.on('message', function(data) {
    	// つながっているクライアント全員に送信
    	console.log("message : " + data.value);
    	io.sockets.emit('message', { value: data.value });
    });

    socket.on('disconnect', function(){
	console.log("disconnect");
    });
});

var net = require('net');
var server = net.createServer(function (stream) {
    stream.on('data', function (data) {
	console.log("tcp : " + data);
	stream.write(data);
	io.sockets.emit('message', { value: data.toString() });
    });
    stream.on('end', function () {
	stream.end();
    });
});
server.listen(1111, 'localhost');
