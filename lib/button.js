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
  var _this     = this;

  this.arduino.pinMode(this.pin, 'in');

  setInterval(function () {
    this.arduino.dRead(_this.pin);
  }.bind(this), 300);

  this.arduino.on('data', function (m) {
    m = m.slice(0, -1).split('::');

    if (m.length > 1 && m[0] == _this.pin) {
      if (m[1] == 0 && _this.down) {
        _this.down = false;
        _this.emit('up');

      } else if (m[1] == 1 && !_this.down) {
        _this.down = true;
        _this.emit('down');
      }
    }
  });
}

util.inherits(Button, events.EventEmitter);

module.exports = Button;

