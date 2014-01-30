//Map controller
app.controller('mapCtrl', function ($scope, $rootScope, $location, Storage, $http) {
  'use strict';

  $scope.dashboard = function () {
    if ($rootScope.lonLat) {
      var lonLatShort = $rootScope.lonLat.toShortString();

      Storage.put('lonLat', lonLatShort);
      $scope.loading = true;

      $http.post('/lonLat', {
        userProps: Storage.getUserProps(),
        token    : Storage.get('token')
      })
        .success(function (data, status) {
          $scope.loading = false;
          $location.path('/dashboard');
        });
    }
  };
});
