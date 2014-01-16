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
      .when('/map', {
        templateUrl: 'views/mapView.html',
        controller : 'mapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!Auth.isLoggedIn()) {
      $location.path('/');

    } else if (Auth.isLoggedIn() && !Auth.hasLatLng()) {
      $location.path('/map');

    } else {
      $location.path('/dashboard');
    }
  });

  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.url = $location.path();
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
app.controller('mainCtrl', function ($scope, socket, $http, $location, Auth) {
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
        $scope.errors    = data.errors;
        $scope.mapErrors = data.mapErrors;
        $scope.error     = null;

      } else if (data.error) {
        console.log(data);
        $scope.errors = $scope.mapErrors = $scope.error = null;

        if (data.error.code === 'EHOSTUNREACH') {
          $scope.error  = {
            'msg': 'Sem conexão com a internet'
          };
        } else {
          $scope.error  = data.error;
        }

      } else if (data.exceptionId) {
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

    })
    .error(function (data, status, headers, config) {
      console.log(data);
    });
  };
});

//Map controller
app.controller('mapCtrl', function ($scope, $location) {
  var map     = new OpenLayers.Map('map');

  var campus = new OpenLayers.Layer.Image('CPBR14', 'img/cpbr14.png',
                    new OpenLayers.Bounds(-180, -90, 180, 90),
                    new OpenLayers.Size(1011, 504),
                    { numZoomLevels: 2 });

  map.addLayers([campus]);
  map.zoomToMaxExtent();

  $scope.dashboard = function () {
    $location.path('/dashboard');
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


/*
 * Services
 */
//Storage
app.service("Storage", function () {
    this.put = function (name, data) {
      localStorage.setItem(name, data);
    };

    this.get = function (name) {
      var name = localStorage.getItem(name);
      return (name) ? name : "";
    };

    this.delete = function (name) {
      localStorage.removeItem(name);
    };
});

//Auth
app.service("Auth", function (Storage, $location) {
    this.isLoggedIn = function () {
      return Storage.get("login");
    };

    this.hasLatLng = function () {
      return Storage.get('latLng');
    };

    this.login = function (login, name, email, tel, m2mToken, csrfToken) {
      Storage.put('login', login);
      Storage.put('name', name);
      Storage.put('email', email);
      Storage.put('tel', tel);
      Storage.put('x-m2m-authtoken', m2mToken);
      Storage.put('x-csrf-token', csrfToken)
    };
});
