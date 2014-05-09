/*****************************************************************/
// Variables
/*****************************************************************/
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

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
    io.sockets.emit("onClientMessageUpdate", data);
  });

  socket.on("onClientRoomChange", function(data) {
    io.sockets.emit("onClientRoomChangeUpdate",data);
  });
});