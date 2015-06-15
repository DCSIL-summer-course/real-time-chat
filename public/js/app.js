var app = angular.module('realTimeChat', ['btford.socket-io']);

app.factory('socket', function(socketFactory){
  return socketFactory();
});

app.factory('chat', function(socket){
  var factory = {};
  factory.users = [];
  factory.messages = [];

  factory.getUsersName = function(){
    factory.name = window.localStorage.getItem('name');

    if(!factory.name){
      factory.name = window.prompt("Please Enter Your Name: ");
      window.localStorage.setItem('name', factory.name);
    }

    return factory.name;
  };

  factory.joinRoom = function(){
    socket.emit('join', {
      name : factory.name
    });
  };

  factory.initialize = function(){
    // attach listeners, listen for
    // events triggered by server
    socket.on('users', function(msg){
      factory.users = msg.users;
    });

    socket.on('new-message', function(msg){
      factory.messages.unshift(msg);
    });

    factory.getUsersName();
    factory.joinRoom();

    return factory.name;
  };

  factory.sendMessage = function(msg){
    socket.emit('send-message', {
      message : msg
    });
  };

  return factory;
});

app.controller('ChatCtrl', function($scope, chat){
  $scope.usersName = chat.initialize();
  
  $scope.$watch(function(){
    return chat.users;
  }, function(users){
    $scope.users = chat.users;
  });

  $scope.$watch(function(){
    return chat.messages;
  }, function(messages){
    $scope.messages = messages;
  });

  $scope.message = { text : '' };

  $scope.sendMessage = function(){
    chat.sendMessage($scope.message.text);
    $scope.message.text = '';
  };
});