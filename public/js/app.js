var app = angular.module('realTimeChat', ['btford.socket-io']);

app.factory('socket', function(socketFactory){
  return socketFactory();
});

app.factory('chat', function(socket, $rootScope){
  var factory = {};
  factory.users = [];

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
    socket.on('users', function(msg){
      factory.users = msg.users;
    });

    factory.getUsersName();
    factory.joinRoom();

    return factory.name;
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
});