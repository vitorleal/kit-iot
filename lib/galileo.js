'use strict';
var fs   = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var Galileo = function () {
  this.lightPin   = 37;
  this.buttonPin  = 18;
  this.sysFsPath  = '/sys/kernel/debug';
  this.exportPath = '/sys/class/gpio/export';
  this.directionPath = function (pin) {
    return '/sys/class/gpio/gpio'+ pin +'/direction';
  };
  this.getValue = function (pin) {
    return '/sys/class/gpio/gpio'+ pin +'/value'
  };
  this.values = {};
}

//Get light
Galileo.prototype.getLight = function () {
  var pin   = this.lightPin,
      self  = this;

  exec('echo -n "'+ pin +'" > '+ this.exportPath + ' && echo -n "out" > ' + this.directionPath(pin) + ' && echo -n "0" > ' + this.getValue(pin), function () {
    exec('cat /sys/bus/iio/devices/iio\:device0/in_voltage0_raw', function (e, stdout) {
      console.log(stdout);
      self.values.light = stdout;
    });
  });
};

//Get button
Galileo.prototype.getButton = function (self) {
  var pin = self.buttonPin;

  exec(this.getValue(pin), function (e, stdout) {
    console.log(stdout);
    self.values.button = stdout;
  });
};

module.exports = Galileo;
