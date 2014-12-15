var open      = require('open'),
    http      = require('http'),
    express   = require('express'),
    bodyParser = require('body-parser'),
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

  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(validator());
  this.app.use(express.static(__dirname + '/../web'));

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

  return this;
};

util.inherits(Server, events.EventEmitter);

module.exports = Server;

