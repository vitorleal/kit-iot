//Storage
app.service("Storage", function () {
  'use strict';

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
