var app = angular.module('realTimeChat', []);


app.controller('ChatCtrl', function($scope){
  $scope.time = new Date();
});