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

app.run(function ($rootScope, $location, Auth, Storage) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!Auth.isLoggedIn()) {
      $location.path('/');

    } else if (Auth.isLoggedIn() && !Auth.hasLonLat()) {
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

//Map controller
app.controller('mapCtrl', function ($scope, $location, Storage, $http) {
  var map     = new OpenLayers.Map('map'),
      campus  = new OpenLayers.Layer.Image('CPBR14', 'img/cpbr14.png',
                new OpenLayers.Bounds(0, 0, 2022, 1009),
                new OpenLayers.Size(1011, 504),
                { numZoomLevels: 2 }),
      markers = new OpenLayers.Layer.Markers( "Markers" ),
      me, lonLat = Storage.get('lonLat');

  map.addLayer(markers);

  if (lonLat) {
    me = new OpenLayers.Marker(OpenLayers.LonLat.fromString(lonLat));
    markers.addMarker(me);
  }

  //Add marker on click
  map.events.register('click', map, function (e) {
    lonLat = map.getLonLatFromViewPortPx(e.xy);

    if (!me) {
      me = new OpenLayers.Marker(lonLat);
      markers.addMarker(me);

    } else {
      markers.removeMarker(me);
      me.destroy();
      me = new OpenLayers.Marker(lonLat);
      markers.addMarker(me);
    }
  });

  map.addLayers([campus]);
  map.zoomToMaxExtent();

  $scope.dashboard = function () {
    if (lonLat) {
      var lonLatShort = lonLat.toShortString();
      Storage.put('lonLat', lonLatShort);

      $http.post('/lonLat', { userProps: Storage.getUserProps() })
        .success(function (data, status) {
          $location.path('/dashboard');
        });
    }
  };
});

//Dashboard controller
app.controller('dashBoardCtrl', function ($scope, socket) {
  $scope.data;
  $scope.connected = false;

  socket.on('data', function (m) {
    $scope.data      = m;
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

    this.getUserProps = function () {
      var userProps = {
        "UserProps": [
          { "name": "nome",  "value": this.get('name') },
          { "name": "email", "value": this.get('email') },
          { "name": "tel",   "value": this.get('tel') }
        ]
      };

      if (this.get('lonLat')) {
        userProps['UserProps'].push({ "name": "lonLat", "value": this.get('lonLat') });
      }

      return JSON.stringify(userProps);
    };
});

//Auth
app.service("Auth", function (Storage, $location) {
    this.isLoggedIn = function () {
      return Storage.get("login");
    };

    this.hasLonLat = function () {
      return Storage.get('lonLat');
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
