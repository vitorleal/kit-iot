var app = angular.module('kitIoT', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/mainView.html',
        controller : 'mainCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboardView.html',
        controller : 'dashBoardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

/*
 * Factorys
 */

//Sockets
app.factory('socket', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});


/*
 * Controllers
 */

//Main controller
app.controller('mainCtrl', function ($scope, socket, $http) {
  $scope.loginUser = function () {
    $http.post('/login', {
      name : $scope.name,
      email: $scope.email,
      login: $scope.login,
      pass : $scope.pass,
      tel  : $scope.tel
    })
    .success(function (data, status, headers, config) {
      if(data.errors) {
        $scope.errors = data.errors;
      } else {
        console.log(data);
      }
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };
});

//Dashboard controller
app.controller('dashBoardCtrl', function ($scope, socket) {
  $scope.data;
  $scope.connected = false;

  socket.on('data', function (m) {
    $scope.data = m;
    $scope.connected = true;
  });

  socket.on('disconnect', function (m) {
    $scope.connected = false;
  });
});
