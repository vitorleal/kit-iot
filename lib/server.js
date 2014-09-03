var open      = require('open'),
    http      = require('http'),
    express   = require('express'),
    validator = require('express-validator'),
    routes    = require('../routes/routes'),
    util      = require('util'),
    events    = require('events');

var Server = function (options) {
  if (!options || !options.port) {
    throw new Error('Must supply required options for server');
  }

  this.port = options.port;
  this.host = options.host || 'http://localhost';
  this.app  = express();

  var _this = this;

  this.app.configure(function () {
    _this.app.use(express.json());
    _this.app.use(express.urlencoded());
    _this.app.use(validator());
    _this.app.use(express.static(__dirname + '/../web'));
    _this.app.use(express.errorHandler());
  });

  //Routes
  routes(this.app);

  //Create server
  this.http = http.createServer(this.app);
  this.http.listen(this.port);

  //Open the page in the browser
  var path = this.host + ":" + this.port;
  console.log('---------------------------------------------');
  console.log('Abra o navegador na url '+ path);
  console.log('---------------------------------------------');

  open(path);

  return _this;
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;
