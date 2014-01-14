var open    = require('open'),
    express = require('express'),
    util    = require('util'),
    routes  = require('../web/routes/routes.js'),
    events  = require('events');

var Server = function(options) {
  if (!options || !options.port) {
    throw new Error('Must supply required options for server');
  }

  this.port = options.port;
  this.host = options.host || 'http://localhost';

  //Create the server
  var app = express();

  app.configure(function() {
    app.set('views', __dirname + '/../web');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + "/../web"));
  });

  //Routes
  routes(app);

  app.listen(this.port);

  open(this.host + ":" + this.port);
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
