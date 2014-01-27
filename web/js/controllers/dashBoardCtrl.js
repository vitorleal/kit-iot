//Dashboard controller
app.controller('dashBoardCtrl', function ($scope, $rootScope, $location, Storage, socket, $http) {
  'use strict';

  $scope.data      = {};
  $scope.msg       = 'Conectando';
  $scope.connected = false;
  $scope.internet  = false;

  //Start to send and save data
  socket.emit('start');

  //On data recieved
  socket.on('data', function (m) {
    $scope.data      = m;
    $scope.connected = true;
  });

  //On button changed
  socket.on('button', function (m) {
    $scope.data.button = m;
  });

  //On disconnect
  socket.on('disconnect', function (m) {
    $scope.internet  = false;
    $scope.msg       = 'Kit desconectado';
    $scope.connected = false;
    $location.path('/disconnect');
  });

  //Logout
  socket.on('logout', function (m) {
    $scope.internet  = false;
    $scope.connected = false;
    $location.path('/logout');
  });

  //On internet connection
  socket.on('internetConnection', function (m) {
    $scope.internet = true;
    $scope.msg      = m.msg;
  });

  //On no internet connection
  socket.on('no-internetConnection', function (m) {
    $scope.internet = false;
    $scope.msg      = m.msg;
  });

});
