var events = require('events'),
    util   = require('util');

/*
 * Button
 */
var Button = function (options) {
  if (!options || !options.arduino) {
    throw new Error('Must supply required options to Button');
  }

  this.arduino  = options.arduino;
  this.pin      = options.pin || 3;
  this.down     = false;
  this.value    = false;
  this.throttle = options.throttle || 1000;

  this.arduino.pinMode(this.pin, 'in');

  setInterval(function () {
    this.arduino.dRead(this.pin);
  }.bind(this), 1000);

  this.arduino.on('data', function (m) {
    m = m.slice(0, -1).split('::');

    if (m.length > 1 && m[0] == this.pin) {
      if (m[1] == 0 && this.down) {
        this.down = false;
        this.emit('up');

      } else if (m[1] == 1 && !this.down) {
        this.down = true;
        this.emit('down');
      }
    }
  }.bind(this));
}

util.inherits(Button, events.EventEmitter);

module.exports = Button;

