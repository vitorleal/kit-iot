var app = angular.module('kitIoT', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/mainView.html',
        controller : 'mainCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboardView.html',
        controller : 'dashBoardCtrl'
      })
      .when('/disconnect', {
        templateUrl: 'views/disconnectView.html',
        controller : 'disconnectCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/mainView.html',
        controller : 'logoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function ($rootScope, $location, Auth, socket) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {

    //If saving data stop
    socket.emit('stop');

    if (!Auth.isLoggedIn()) {
      $location.path('/');

    } else if (next.templateUrl === 'views/disconnectView.html') {
      $location.path('/disconnect');

    } else {
      $location.path('/dashboard');
    }
  });

  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.url = $location.path();
  });
});

