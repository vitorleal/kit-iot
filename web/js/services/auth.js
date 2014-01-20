//Auth
app.service("Auth", function ($rootScope, Storage, $location) {
  'use strict';

  this.isLoggedIn = function () {
    return Storage.get("login");
  };

  this.hasLonLat = function () {
    return Storage.get('lonLat');
  };

  this.login = function (login, name, email, tel, m2mToken, csrfToken) {
    $rootScope.name = name;
    Storage.put('login', login);
    Storage.put('name', name);
    Storage.put('email', email);
    Storage.put('tel', tel);
    Storage.put('x-m2m-authtoken', m2mToken);
    Storage.put('x-csrf-token', csrfToken)
  };

  this.logout = function () {
    $rootScope.name   = null;
    $rootScope.lonLat = null;
    Storage.delete('login');
    Storage.delete('name');
    Storage.delete('email');
    Storage.delete('tel');
    Storage.delete('lonLat');
    Storage.delete('x-m2m-authtoken');
    Storage.delete('x-csrf-token');
  };
});
