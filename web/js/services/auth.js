//Auth
app.service("Auth", function (Storage, $location) {
  'use strict';

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
