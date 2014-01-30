var kit     = require('./kit'),
    request = require('request'),
    token   = new kit.Token();

//Kit IoT
var KitIoT = function () {
  this.token  = token;
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
    }).on('up', function () {
      self.button.value = 0;
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
  }
};

//Start loop to send and save data
KitIoT.prototype.start = function () {
  var self = this;

  self.loop = setInterval(function () {
    var data = self.getSensorValues();

    console.log(data);
    self.saveData(data);

  }, 1000);
};

//Save data to DCA
KitIoT.prototype.saveData = function (data) {
  var self    = this,
      URL     = 'http://dca.telefonicabeta.com:8002',
      rawBody = '|||8:78||bt|'+ data.button +'#|||8:1||tm|'+ data.temperature +'#|||8:3||hm|'+ data.humidity +'#|||8:61||lu|'+ data.light +'#|||8:23||ru|'+ data.noise,
      tokenId = token.getId();

  if (!tokenId) {
    console.log('Seu token não foi definido');

  } else {
    request({
      method: 'POST',
      url   : URL + '/idas/2.0?apikey='+ tokenId +'&ID='+ tokenId,
      body  : rawBody

    }, function (err, res, body) {
      if (!err) {
        if (res.statusCode === 200) {
          console.log('Data saved - ' + new Date());

        } else {
          console.log('Sem conexão ')
          self.io.sockets.emit('no-internetConnection', { msg: 'Erro ao salvar os dados do Kit' });
        }
      } else {
        if (err.code === 'EHOSTUNREACH') {
         self.io.sockets.emit('no-internetConnection', { msg: 'Sem conexão com a internet' });
        }
      }
    });
  }

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
