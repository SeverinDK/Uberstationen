/*****************************************************************/
// Variables
/*****************************************************************/
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var Message = require('./src/storage/message');

var connections = [];

/*****************************************************************/
// Socket
/*****************************************************************/
app.listen(1337);

function handler (req, res) {
  console.log(__dirname + req.url);
    fs.readFile(__dirname + req.url, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }
    res.writeHead(200);
    res.end(data);
  });
}

/*****************************************************************/
// Socket events
/*****************************************************************/
io.sockets.on("connection", function (socket) {

  if(!connections[socket.id]) {
    connections[socket.id] = socket.id;
  }

  io.sockets.emit("onClientConnect", {client:socket.id,connections:JSON.stringify(connections)});

  socket.on('disconnect', function() {
    if(connections[socket.id]) {
      delete connections[socket.id];
    }
    io.sockets.emit("onClientDisconnect", socket.id);
  });

  socket.on("onClientMove", function(data) {
    io.sockets.emit("onClientMoveUpdate", data);
  });

  socket.on("onClientMessage", function(data) {

	  //Create message to save
	  var messageEntry = {
		  user_id: data.client,
		  room_id: 0,
		  message: data.message
	  };

	var msg = new Message(messageEntry);

	  msg.save(function(err) {
		if(err) throw err;
		console.log('Message persisted');
	});

    io.sockets.emit("onClientMessageUpdate", data);
  });

  socket.on("onClientRoomChange", function(data) {
    io.sockets.emit("onClientRoomChangeUpdate",data);
  });
});