var events = require('events'),
    util   = require('util');

/*
 * Button
 */
var Button = function (options) {
  if (!options || !options.arduino) {
    throw new Error('Must supply required options to Button');
  }

  this.arduino = options.arduino;
  this.pin     = options.pin || 3;
  this.down    = false;
  this.value   = false;
  var self     = this;

  this.arduino.pinMode(this.pin, 'in');

  setInterval(function () {
    this.arduino.dRead(self.pin);
  }.bind(this), 300);

  this.arduino.on('data', function (m) {
    m = m.slice(0, -1).split('::');

    if (m.length > 1 && m[0] == self.pin) {
      if (m[1] == 0 && self.down) {
        self.down = false;
        self.emit('up');

      } else if (m[1] == 1 && !self.down) {
        self.down = true;
        self.emit('down');
      }
    }
  });
}

util.inherits(Button, events.EventEmitter);

module.exports = Button;

