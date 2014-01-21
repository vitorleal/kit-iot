var open    = require('open'),
    http    = require('http'),
    express = require('express'),
    expressValidator = require('express-validator'),
    routes  = require('../web/routes/routes'),
    util    = require('util'),
    events  = require('events');

var Server = function (options) {
  if (!options || !options.port) {
    throw new Error('Must supply required options for server');
  }

  this.port = options.port;
  this.host = options.host || 'http://localhost';
  this.app  = express();

  var self = this;

  this.app.configure(function () {
    self.app.use(express.json());
    self.app.use(express.urlencoded());
    self.app.use(expressValidator([options]));
    self.app.use(express.static(__dirname + '/../web'));
    self.app.use(express.errorHandler());
  });

  //Routes
  routes(this.app);

  //Create server
  this.http = http.createServer(this.app);
  this.http.listen(this.port);

  //Open the page in the browser
  open(this.host + ":" + this.port);

  return self;
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
