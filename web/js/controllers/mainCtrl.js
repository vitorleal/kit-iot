//Main controller
app.controller('mainCtrl', function ($scope, socket, $http, $location, Auth, Storage) {
  'use strict';

  $scope.loginUser = function () {
    $scope.loading = true;

    $http.post('/login', {
      name : $scope.name, email: $scope.email, token: $scope.token, pass: $scope.pass, tel: $scope.tel
    })
    .success(function (data, status, headers) {

      $scope.loading = false;

      if(data.errors) {
        $scope.errors    = data.errors;
        $scope.mapErrors = data.mapErrors;
        $scope.error     = null;

      } else if (data.error) {
        $scope.errors = $scope.mapErrors = $scope.error = null;

        if (data.error.code === 'EHOSTUNREACH') {
          $scope.error  = {
            'msg': 'Sem conexão com a internet'
          };
        } else {
          $scope.error  = data.error;
        }

      } else if (data.exceptionId) {
        $scope.errors = $scope.mapErrors = $scope.error = null;

        $scope.error = {
          'msg': 'Erro ao autenticar o token'
        };
        $scope.mapErrors = {
          'token': 'Erro ao autenticar o token',
        };

      } else {
        $scope.errors = $scope.mapErrors = $scope.error = null;
        Auth.login($scope.token, $scope.name, $scope.email, $scope.tel);

        $location.path('/map');
      }

    })
    .error(function (data, status) {
       $scope.loading = false;
    });
  };
});
