//Auth
app.service("Auth", function ($rootScope, Storage, $location) {
  'use strict';

  this.isLoggedIn = function () {
    return Storage.get("token");
  };

  this.hasLonLat = function () {
    return Storage.get('lonLat');
  };

  this.login = function (token, name, email, tel) {
    $rootScope.name  = name;
    $rootScope.token = token;

    Storage.put('token', token);
    Storage.put('name', name);
    Storage.put('email', email);
    Storage.put('tel', tel);
  };

  this.logout = function () {
    $rootScope.name   = null;
    $rootScope.token  = null;
    $rootScope.lonLat = null;

    Storage.delete('token');
    Storage.delete('name');
    Storage.delete('email');
    Storage.delete('tel');
    Storage.delete('lonLat');
  };
});
