var kit     = require('./kit'),
    request = require('request'),
    io      = require('socket.io'),
    fs      = require('fs'),
    path    = require('path'),
    file    = path.resolve(__dirname, '..')+ '/.token',
    token   = null;

//Kit IoT
var KitIoT = function () {
  this.server = new kit.Server({ port: '4000' });
  this.io     = io.listen(this.server.http, { log: false });
};

//Connect
KitIoT.prototype.connect = function () {
  var self = this;

  if (!this.arduino) {
    this.arduino = new kit.Arduino();
    this.button  = new kit.Button({ arduino: this.arduino, pin: 3 });
    this.light   = new kit.Sensor({ arduino: this.arduino, pin: 'A0' });
    this.noise   = new kit.Sensor({ arduino: this.arduino, pin: 'A1' });
    this.dht11   = new kit.Dht11({  arduino: this.arduino, pin: 2 });

    this.button.value = 0;

    //Button
    this.button.on('down', function () {
      self.button.value = 1;
      self.io.sockets.emit('button', self.button.value);

    }).on('up', function () {
      self.button.value = 0;
      self.io.sockets.emit('button', self.button.value);
    });

    //Luminosity
    this.light.on('read', function (m) {
      self.light.value = m;
    });

    //Noise
    this.noise.on('read', function (m) {
      self.noise.value = m;
    });

    //Temperature and Humidity
    this.dht11.on('read', function (m) {
      if (m.temperature && m.humidity) {
        self.dht11.temperature = parseFloat(m.temperature);
        self.dht11.humidity    = parseFloat(m.humidity);
      }
    });

    //On arduino ready send data do DCA
    this.arduino.on('ready', function () {
      self.loop = setInterval(function () {
        var data = self.getSensorValues();

        self.io.sockets.emit('data', data);
        self.saveData(data);
      }, 1000);
    });

    //On arduino error
    this.arduino.on('error', function (e) {
      self.disconnect();
    });

    //On uncaught exception kill process
    process.on('uncaughtException', function (err) {
      console.log(err);
      self.disconnect();
    });
  }
};

//Save data to DCA
KitIoT.prototype.saveData = function (data) {
  var self    = this,
      URL     = 'http://dca.telefonicabeta.com:8002',
      rawBody = '|||8:78||bt|'+ data.button +'#|||8:1||tm|'+ data.temperature +'#|||8:3||hm|'+ data.humidity +'#|||8:61||lu|'+ data.light +'#|||8:23||ru|'+ data.noise;

  console.log(rawBody);
  if (fs.existsSync(file)) {
    token = fs.readFileSync(file, 'utf8');
  }

  console.log(token);
  console.log(URL + '/idas/2.0?apikey='+ token +'&ID='+ token);
  request({
    method: 'POST',
    url: URL + '/idas/2.0?apikey='+ token +'&ID='+ token,
    body: rawBody

  }, function (err, res, body) {
    console.log(err);

    if (!err) {
      if (res.statusCode === 200) {
        self.io.sockets.emit('internetConnection', { msg: 'Conectado na nuvem' });
        console.log('Data saved - ' + new Date());

      } else {
        self.io.sockets.emit('no-internetConnection', { msg: 'Erro ao salvar os dados do Kit' });
      }
    } else {
      if (err.code === 'EHOSTUNREACH') {
       self.io.sockets.emit('no-internetConnection', { msg: 'Sem conexão com a internet' });
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
  this.io.sockets.emit('disconnect');
  this.clearLoop(this.loop);
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
