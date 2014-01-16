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

