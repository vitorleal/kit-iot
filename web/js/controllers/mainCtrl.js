//Main controller
app.controller('mainCtrl', function ($scope, socket, $http, $location, Auth, Storage) {
  $scope.loginUser = function () {
    $http.post('/login', {
      name : $scope.name, email: $scope.email, login: $scope.login, pass: $scope.pass, tel: $scope.tel
    })
    .success(function (data, status, headers, config) {

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
          'msg': 'Erro ao autenticar o login/senha'
        };
        $scope.mapErrors = {
          'login': 'Erro ao autenticar o login/senha',
          'pass' : 'Erro ao autenticar o login/senha'
        };

      } else {
        $scope.errors = $scope.mapErrors = $scope.error = null;
        Auth.login($scope.login, $scope.name, $scope.email, $scope.tel, data['x-m2m-authtoken'], data['x-csrf-token']);

        $location.path('/map');
      }

    });
  };
});
