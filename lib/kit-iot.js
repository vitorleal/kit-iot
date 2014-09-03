var kit     = require('./kit'),
    request = require('request'),
    io      = require('socket.io'),
    token   = new kit.Token();

//Kit IoT
var KitIoT = function () {
  this.server = new kit.Server({ port: '4000' });
  this.io     = io.listen(this.server.http, { log: false });
  this.token  = token;
};

//Connect
KitIoT.prototype.connect = function () {
  var _this = this;

  if (!this.arduino) {
    this.arduino = new kit.Arduino();
    this.button  = new kit.Button({ arduino: this.arduino, pin: 3 });
    this.light   = new kit.Sensor({ arduino: this.arduino, pin: 'A0' });
    this.noise   = new kit.Sensor({ arduino: this.arduino, pin: 'A1' });
    this.dht11   = new kit.Dht11({  arduino: this.arduino, pin: 2 });

    this.button.value = 0;

    //Button
    this.button.on('down', function () {
      _this.button.value = 1;
      _this.io.sockets.emit('button', _this.button.value);

    }).on('up', function () {
      _this.button.value = 0;
      _this.io.sockets.emit('button', _this.button.value);
    });

    //Luminosity
    this.light.on('read', function (m) {
      _this.light.value = m;
    });

    //Noise
    this.noise.on('read', function (m) {
      _this.noise.value = m;
    });

    //Temperature and Humidity
    this.dht11.on('read', function (m) {
      if (m.temperature && m.humidity) {
        _this.dht11.temperature = parseFloat(m.temperature);
        _this.dht11.humidity    = parseFloat(m.humidity);
      }
    });

    //On arduino error
    this.arduino.on('error', function (e) {
      _this.disconnect();
    });

    //On uncaught exception kill process
    process.on('uncaughtException', function (err) {
      console.log(err);
      _this.disconnect();
    });
  }
};

//Start loop to send and save data
KitIoT.prototype.start = function () {
  var _this = this;

  //Start the loop
  _this.loop = setInterval(function () {
    var data = _this.getSensorValues();

    _this.io.sockets.emit('data', data);
    _this.saveData(data);

  }, 3000);
};

//Save data to DCA
KitIoT.prototype.saveData = function (data) {
  var _this    = this,
      URL     = 'https://api.xively.com/v2/feeds/',
      rawBody = {
        "version":"1.0.0",
         "datastreams" : [ {
            "id": "botao",
            "current_value": data.button
          }, {
            "id": "temperatura",
            "current_value": data.temperature
          }, {
            "id": "umidade",
            "current_value": data.humidity
          }, {
            "id": "liminosidade",
            "current_value": data.light
          }, {
            "id": "ruido",
            "current_value": data.noise
          }
        ]
      },
      feedId  = '706777630';

  request({
    method: 'PUT',
    url   : URL + feedId + '.json',
    body  : JSON.stringify(rawBody),
    headers: {
      'X-ApiKey': 'CUdEMROfFjCaPKQuMQTm7mAtcG3Tlw0Fr1QhD2AOJORXob7b'
    }
  }, function (err, res, body) {
    if (!err) {
      if (res.statusCode === 200) {
        _this.io.sockets.emit('internetConnection', { msg: 'Conectado na nuvem' });
        console.log('Data saved - ' + new Date());

      } else {
        _this.io.sockets.emit('no-internetConnection', { msg: 'Erro ao salvar os dados do Kit' });
      }
    }
  });
};

//Clear loop
KitIoT.prototype.clearLoop = function (l) {
  clearInterval(l);
};

//Disconnect
KitIoT.prototype.disconnect = function () {
  this.clearLoop(this.loop);
  this.io.sockets.emit('disconnect');
};

//Logout
KitIoT.prototype.logout = function () {
  this.clearLoop(this.loop);
  this.io.sockets.emit('logout');
};

//Get sensor values
KitIoT.prototype.getSensorValues = function () {
  return {
    button     : this.button.value,
    light      : this.light.value,
    noise      : this.noise.value,
    temperature: this.dht11.temperature,
    humidity   : this.dht11.humidity
  };
};

module.exports = KitIoT;
