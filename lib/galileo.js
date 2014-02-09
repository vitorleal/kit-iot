'use strict';
var fs   = require('fs'),
    path = require('path'),
    sh   = require('execSync');

var Galileo = function () {
  this.lightPin   = 37;
  this.noisePin   = 36;
  this.buttonPin  = 18;
  this.sysFsPath  = '/sys/kernel/debug';
  this.exportPath = '/sys/class/gpio/export';
  this.directionPath = function (pin) {
    return '/sys/class/gpio/gpio'+ pin +'/direction';
  };
  this.getValue = function (pin, id) {
    return '/sys/class/gpio/gpio'+ pin +'/value'
  };
  this.getAnalogic = function (id) {
    return 'cat /sys/bus/iio/devices/iio\:device0/in_voltage'+ id +'_raw';
  };
}

//Init board
Galileo.prototype.init = function (pins) {
  var self = this;

  this.pins = pins || [this.lightPin, this.noisePin, this.buttonPin];

  this.pins.forEach(function (e, i) {
    sh.run('echo -n "'+ e +'" > '+ self.exportPath);
  });
}

//Close GPIOS
Galileo.prototype.close = function () {
  if (this.pins) {
    console.log(this.pins);
  } else {
    throw new Error('Nenhum pin foi configurado');
  }
}

//Get light
Galileo.prototype.getLight = function () {
  var pin = this.lightPin,
      value;
  
  sh.run('echo -n "out" > ' + this.directionPath(pin));
  sh.run('echo -n "0" > ' + this.getValue(pin));
  value = sh.exec(this.getAnalogic(0));

  return value.stdout;
}

//Get noise
Galileo.prototype.getNoise = function () {
  var pin = this.noisePin,
      value;

  sh.run('echo -n "out" > ' + this.directionPath(pin));
  sh.run('echo -n "0" > ' + this.getValue(pin));
  value = sh.exec(this.getAnalogic(1));

  return value.stdout;
}

//Get button
Galileo.prototype.getButton = function () {
  var pin   = this.buttonPin,
      value = sh.exec('cat ' + this.getValue(pin));

  return value.stdout;
}

module.exports = Galileo;
