var events = require('events'),
    util   = require('util');

var Dht11 = function (options) {
  if (!options || !options.board) {
    throw new Error('Must supply required options to Sensor');
  }

  this.board = options.board;
  this.pin   = options.pin || '2';
  this.board.pinMode(this.pin, 'in');

  setInterval(function () {
    this.board.dht11(this.pin);
  }.bind(this), options.throttle || 50);


  this.board.on('data', function (message) {
    var m   = message.slice(0, -1).split('::'),
        err = null,
        pin, data;

    if (!m.length) {
      return;
    }

    pin = m[0];

    if (m.length === 3) {
      data = {
        temperature: m[1],
        humidity   : m[2]
      };
    }

    if (pin === this.pin) {
      this.emit('read', err, data);
    }

  }.bind(this));
};

util.inherits(Dht11, events.EventEmitter);

module.exports = Dht11;

