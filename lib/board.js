var events = require('events'),
    util   = require('util'),
    serial = require('serialport');

/*
 * Board class
 */
var Board = function (options) {
  this.log('info', 'initializing');

  this.debug       = options && options.debug || false;
  this.baudrate    = options && options.baudrate || 115200;
  this.writeBuffer = [];

  var self = this;

  this.detect(function (err, serial) {
    if (err) {
      if(self.listeners('error').length) {
        self.emit('error', err);

      } else {
        throw new Error(err);
      }

    } else {
      self.serial = serial;
      self.emit('connected');

      self.log('info', 'binding serial events');
      self.serial.on('data', function(data) {
        self.log('receive', data.toString().red);
        self.emit('data', data);
      });

      setTimeout(function () {
        self.log('info', 'board ready');
        self.sendClearingBytes();

        if (self.debug) {
          self.log('info', 'sending debug mode toggle on to board');
          self.write('99' + self.normalizePin(0) + self.normalizeVal(1));
        }

        if (self.writeBuffer.length > 0) {
          self.processWriteBuffer();
        }

        self.emit('ready');
      }, 1000);
    }
  });
};

util.inherits(Board, events.EventEmitter);


/*
 * Detect an Arduino board
 */
Board.prototype.detect = function (callback) {
  var rport = /usb|acm|^com/i,
      self  = this, ports;

  serial.list(function(err, result) {
    var ports, length, possible, found;

    ports = result.filter(function(val) {
      var available = true;

      // Match only ttyUSB#, cu.usbmodem#, COM#
      if (!rport.test(val.comName)) {
        available = false;
      }

      return available;

    }).map(function(val) {
      return val.comName;
    });

    length = ports.length;

    if (!ports.length) {
      err = new Error('Could not find Arduino');
    }

    while (ports.length) {
      possible = ports.pop();

      try {
        temp = new serial.SerialPort(possible, {
          baudrate: self.baudrate,
          parser: serial.parsers.readline('\n')
        });

      } catch (e) {
        err = e;
      }

      if (!err) {
        found = temp;
        self.log('info', 'found board at ' + temp.port);
        break;

      } else {
        err = new Error('Could not find Arduino');
      }
    }

    callback(err, found);
  });
};

/*
 * The board will eat the first 4 bytes of the session
 */
Board.prototype.sendClearingBytes = function () {
  this.serial.write('00000000');
};

/*
 * Process the writeBuffer (messages attempted before serial was ready)
 */
Board.prototype.processWriteBuffer = function () {
  this.log('info', 'processing buffered messages');

  while (this.writeBuffer.length > 0) {
    this.log('info', 'writing buffered message');
    this.write(this.writeBuffer.shift());
  }
};

/*
 * Low-level serial write
 */
Board.prototype.write = function (m) {
  if (this.serial) {
    this.log('write', m);
    this.serial.write('!' + m + '.');

  } else {
    this.log('info', 'serial not ready, buffering message: ' + m.red);
    this.writeBuffer.push(m);
  }
};

/*
 * Add a 0 to the front of a single-digit pin number
 */
Board.prototype.normalizePin = function (pin) {
  return this.lpad( 2, '0', pin );
};

Board.prototype.normalizeVal = function(val) {
	return this.lpad( 3, '0', val );
};

Board.prototype.lpad = function(len, chr, str) {
  return (Array(len + 1).join(chr || ' ') + str).substr(-len);
};

/*
 * Set a pin's mode
 * val == out = 001
 * val == in  = 000
 */
Board.prototype.pinMode = function (pin, val) {
  pin = this.normalizePin(pin);
  this.log('info', 'set pin ' + pin + ' mode to ' + val);
  val = (
    val == 'out' ?
    this.normalizeVal(1) :
    this.normalizeVal(0)
  );
  this.write('00' + pin + val);
};

/*
 * Write to a digital pin
 */
Board.prototype.digitalWrite = function (pin, val) {
  pin = this.normalizePin(pin);
  val = this.normalizeVal(val);
  this.log('info', 'digitalWrite to pin ' + pin + ': ' + val.green);
  this.write('01' + pin + val);
};

/*
 * Extract data from a pin
 */
Board.prototype.digitalRead = function (pin) {
  pin = this.normalizePin(pin);
  this.log('info', 'digitalRead from pin ' + pin);
  this.write('02' + pin + this.normalizeVal(0));
};

Board.prototype.analogWrite = function (pin, val) {
	pin = this.normalizePin(pin);
	val = this.normalizeVal(val);
	this.log('info', 'analogWrite to pin ' + pin + ': ' + val.green);
	this.write('03' + pin + val);
};

Board.prototype.analogRead = function (pin) {
	pin = this.normalizePin(pin);
	this.log('info', 'analogRead from pin ' + pin);
	this.write('04' + pin + this.normalizeVal(0));
};

Board.prototype.dht11 = function (pin) {
  pin = this.normalizePin(pin);
  this.log('info', 'dht11 read from pin ' + pin);
  this.write('05' + pin + this.normalizeVal(0));
};


/*
 * Logger utility function
 */
Board.prototype.log = function () {
  var args = [].slice.call(arguments);

  if (this.debug) {
    console.log(String(+new Date()).grey + ' kit-iot '.blue + args.shift().magenta + ' ' + args.join(', '));
  }
};

module.exports = Board;
