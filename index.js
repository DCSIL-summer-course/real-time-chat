var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

var users = {};
var sockets = {}

function broadcastUsers(){
  _.each(sockets, function(socket){
    socket.emit('users', {
      users : Object.keys(users)
    });
  });
}

io.on('connection', function(socket){
  var name;
  socket.on('join', function(msg){
    name = msg.name;
    users[name] = name;
    sockets[socket.id] = socket;
    broadcastUsers();
  });

  socket.on('disconnect', function(){
    delete users[name];
    delete sockets[socket.id];
    broadcastUsers();
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});