'use strict';
var sh = require('execSync');

var Galileo = function () {
  this.lightPin   = 37;
  this.noisePin   = 36;
  this.buttonPin  = 18;
  this.unexportPath  = '/sys/class/gpio/unexport';
  this.exportPath    = '/sys/class/gpio/export';
  this.directionPath = function (pin) {
    return '/sys/class/gpio/gpio'+ pin +'/direction';
  };
  this.getValue = function (pin) {
    return '/sys/class/gpio/gpio'+ pin +'/value';
  };
  this.getAnalog = function (id) {
    return 'cat /sys/bus/iio/devices/iio\:device0/in_voltage'+ id +'_raw';
  };
}

//Init board
Galileo.prototype.init = function (pins) {
  var self = this;

  this.pins = pins || [this.lightPin, this.noisePin, this.buttonPin];

  this.pins.forEach(function (e, i) {
    sh.run('echo -n "'+ e +'" > ' + self.exportPath);
  });
}

//Close GPIOS
Galileo.prototype.close = function () {
  var self = this;

  if (this.pins) {
    this.pins.forEach(function (e, i) {
      sh.run('echo -n "'+ e +'" > ' + self.unexportPath);
      console.log('Unexported pin ' + e);
    });

  } else {
    throw new Error('You need to set pins before');
  }
}

//Get light
Galileo.prototype.getLight = function () {
  var pin = this.lightPin,
      value;
  
  sh.run('echo -n "out" > ' + this.directionPath(pin));
  sh.run('echo -n "0" > ' + this.getValue(pin));
  value = sh.exec(this.getAnalog(0));

  return this.convert(value.stdout);
}

//Get noise
Galileo.prototype.getNoise = function () {
  var pin = this.noisePin,
      value;

  sh.run('echo -n "out" > ' + this.directionPath(pin));
  sh.run('echo -n "0" > ' + this.getValue(pin));
  value = sh.exec(this.getAnalog(1));

  return this.convert(value.stdout);
}

//Get button
Galileo.prototype.getButton = function () {
  var pin   = this.buttonPin,
      value = sh.exec('cat ' + this.getValue(pin));

  return parseFloat(value.stdout);
}

//Convert
Galileo.prototype.convert = function (val) {
  var max    = 4095,
      limit  = 1024,
      result = val * limit / max;

  return parseInt(result, 10);
}

module.exports = Galileo;
