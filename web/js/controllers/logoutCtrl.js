app.controller('logoutCtrl', function ($location, Auth) {
  'use strict';

  Auth.logout();
  $location.path('/');
});
