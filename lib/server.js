var open    = require('open'),
    connect = require('connect'),
    util    = require('util'),
    events  = require('events');

var Server = function (options) {
  if (!options || !options.port) {
    throw new Error('Must supply required options for server');
  }

  this.port = options.port;
  this.host = options.host || 'http://localhost';

  //Create the server
  this.connect = connect().use(connect.static(__dirname + '/../web')).listen(this.port);

  //Open the page in the browser
  open(this.host + ":" + this.port);
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
