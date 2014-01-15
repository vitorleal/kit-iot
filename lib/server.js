var open    = require('open'),
    http    = require('http'),
    express = require('express'),
    expressValidator = require('express-validator'),
    util    = require('util'),
    routes  = require('../web/routes/routes'),
    events  = require('events');

var Server = function (options) {
  if (!options || !options.port) {
    throw new Error('Must supply required options for server');
  }

  var self = this;

  self.port = options.port;
  self.host = options.host || 'http://localhost';
  self.app  = express();

  self.app.configure(function () {
    self.app.use(express.bodyParser());
    self.app.use(expressValidator([options]));
    self.app.use(express.static(__dirname + '/../web'));
  });

  //Routes
  routes(self.app);

  //Create server
  self.http = http.createServer(self.app);
  self.http.listen(self.port);

  //Open the page in the browser
  open(self.host + ":" + self.port);

  return self;
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
