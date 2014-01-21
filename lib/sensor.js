var events     = require('events'),
    util       = require('util');

var Sensor = function (options) {
  if (!options || !options.arduino) {
    throw new Error('Must supply required options to Sensor');
  }

  this.arduino  = options.arduino;
  this.pin      = options.pin || 'A0';
  this.throttle = options.throttle || 500;
  this.arduino.pinMode(this.pin, 'in');

  setInterval(function () {
    this.arduino.aRead(this.pin);
  }.bind(this), this.throttle);

  this.arduino.on('data', function (message) {
    var m = message.slice(0, -1).split('::'),
        pin, data;

    if (!m.length) {
      return;
    }

    pin  = m[0]
    data = m.length === 2 ? m[1] : null;

    if (pin === this.pin) {
      this.emit('read', data);
    }

  }.bind(this));
};

util.inherits(Sensor, events.EventEmitter);

module.exports = Sensor;
