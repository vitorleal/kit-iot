var Galileo = require('./lib/galileo');

var galileo = new Galileo();

galileo.init();

setInterval(function () {
  galileo.getLight();
  galileo.getButton();
  galileo.getNoise();
}, 1000);
