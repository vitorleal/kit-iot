var events     = require('events'),
    compulsive = require('compulsive'),
    util       = require('util');

var Sensor = function (options) {
  if (!options || !options.board) {
    throw new Error('Must supply required options to Sensor');
  }

  this.board = options.board;
  this.pin   = options.pin || 'A0';
  this.board.pinMode(this.pin, 'in');

  compulsive.loop(options.throttle || 200, function () {
    this.board.analogRead(this.pin);
  }.bind(this));


  this.board.on('data', function (message) {
    var m   = message.slice(0, -1).split('::'),
        err = null,
        pin, data;

    if (!m.length) {
      return;
    }

    pin  = m[0]
    data = m.length === 2 ? m[1] : null;

    if (pin === this.pin) {
      this.emit('read', err, data);
    }

  }.bind(this));
};

util.inherits(Sensor, events.EventEmitter);

module.exports = Sensor;
