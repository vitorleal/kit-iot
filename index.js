var events  = require('events'),
    util    = require('util'),
    Galileo = require('./lib/galileo');

/*
 * Galileo class
 */
var galileo = new Galileo();

setInterval(function () {
  galileo.getLight();
}, 2000);

