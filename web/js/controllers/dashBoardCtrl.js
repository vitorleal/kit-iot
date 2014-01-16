//Dashboard controller
app.controller('dashBoardCtrl', function ($scope, $rootScope, Storage, socket) {
  $scope.data;
  $scope.connected = false;

  $rootScope.name = Storage.get('name');

  socket.on('data', function (m) {
    $scope.data      = m;
    $scope.connected = true;
  });

  socket.on('disconnect', function (m) {
    $scope.connected = false;
  });
});
