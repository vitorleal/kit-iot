var events = require('events'),
    util   = require('util');

/*
 * DHT11 sensor
 * http://www.micro4you.com/files/sensor/DHT11.pdf
 */

var Dht11 = function (options) {
  if (!options || !options.arduino) {
    throw new Error('Must supply required options to Dht11');
  }

  this.arduino = options.arduino;
  this.pin     = options.pin || '2';
  this.arduino.pinMode(this.pin, 'in');

  setInterval(function () {
    this.arduino.dht11(this.pin);
  }.bind(this), options.throttle || 1000);

  this.arduino.on('data', function (message) {
    var m = message.slice(0, -1).split('::'),
        pin, data, thisPin;

    if (!m.length) {
      return;
    }

    pin     = m[0];
    thisPin = this.arduino.normalizePin(this.pin);

    if (m.length === 3 && pin === thisPin) {
      data = {
        temperature: m[1],
        humidity   : m[2]
      };

      this.emit('read', data);
    }

  }.bind(this));
};

util.inherits(Dht11, events.EventEmitter);

module.exports = Dht11;

