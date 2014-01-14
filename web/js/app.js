/*(function () {
  var init = function () {
    var socket    = io.connect('http://localhost:4000'),
        connected = false;

    socket.on('data', function (data) {
      //if (connected) {
        console.log(data);
      //}
    });
  };

  window.onload = init();
})();
*/

var app = angular.module('kitIoT', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/mainView.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


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
      })
    }
  };
});

app.controller('MainCtrl', function($scope, socket) {
  $scope.data;

  socket.on('data', function(m) {
    $scope.data = m;
  });
});
