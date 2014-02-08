var kit     = require('./kit'),
    request = require('request'),
    io      = require('socket.io'),
    token   = new kit.Token(),
    galileo = new kit.Galileo();

//Kit IoT
var KitIoT = function () {
  this.server = new kit.Server({ port: '4000' });
  this.io     = io.listen(this.server.http, { log: false });
};

//Connect
KitIoT.prototype.connect = function () {
  galileo.clean();
  galileo.init();
};

//Start loop to send and save data
KitIoT.prototype.start = function () {
  var self = this;

  self.loop = setInterval(function () {
    var data = self.getSensorValues();

    self.io.sockets.emit('data', data);
    self.saveData(data);

  }, 1000);
};

//Save data to DCA
KitIoT.prototype.saveData = function (data) {
  var self    = this,
      URL     = 'http://dca.telefonicabeta.com:8002',
      rawBody = '|||8:78||bt|'+ data.button +'#|||8:61||lu|'+ data.light +'#|||8:23||ru|'+ data.noise,
      tokenId = token.getId();

  if (!tokenId) {
    self.io.sockets.emit('no-internetConnection', { msg: 'API token não encontrado' });

  } else {
    request({
      method: 'POST',
      url   : URL + '/idas/2.0?apikey='+ tokenId +'&ID='+ tokenId,
      body  : rawBody

    }, function (err, res, body) {
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
  }

};

//Clear loop
KitIoT.prototype.clearLoop = function (l) {
  clearInterval(l);
};

//Get sensor values
KitIoT.prototype.getSensorValues = function () {
  return {
    button     : galileo.getButton(),
    light      : galileo.getLight(),
    noise      : galileo.getNoise()
  };
};

module.exports = KitIoT;
