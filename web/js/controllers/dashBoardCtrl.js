//Dashboard controller
app.controller('dashBoardCtrl', function ($scope, $rootScope, $location, Storage, socket) {
  'use strict';

  $scope.data      = {};
  $scope.connected = false;
  $rootScope.name  = Storage.get('name');

  socket.on('data', function (m) {
    $scope.data      = m;
    $scope.connected = true;
  });

  socket.on('button', function (m) {
    $scope.data.button = m;
  });

  socket.on('disconnect', function (m) {
    $scope.connected = false;
    $location.path('/disconnect');
  });
});
