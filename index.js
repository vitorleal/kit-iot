var kitIoT  = require('./lib/kit-iot'),
    server  = new kitIoT.Server({ port: '4000' }),
    request = require('request'),
    io      = require('socket.io').listen(server.http, { log: false });

//Sensors
var loop, arduino, button, light, noise, dht11 = {};

//On io connection start the arduino
io.on('connection', function (socket) {
  connectArduino();
});

//Connect to the arduino
var connectArduino = function () {
  if (!arduino) {
    arduino = new kitIoT.Arduino();
    button  = new kitIoT.Button({ arduino: arduino });
    light   = new kitIoT.Sensor({ arduino: arduino });
    noise   = new kitIoT.Sensor({ arduino: arduino });
    temp    = new kitIoT.Dht11({  arduino: arduino });

    button.value = 0;

    //Button
    button.on('down', function () {
      button.value = 1;
      io.sockets.emit('button', button.value);

    }).on('up', function () {
      button.value = 0;
      io.sockets.emit('button', button.value);
    });

    //Luminosity
    light.on('read', function (m) {
      light.value = m;
    });

    //Noise
    noise.on('read', function (m) {
      noise.value = m;
    });

    //Temperature and Humidity
    temp.on('read', function (m) {
      if (m.temperature && m.humidity) {
        dht11.temperature = parseFloat(m.temperature);
        dht11.humidity    = parseFloat(m.humidity);
      }
    });

    //On arduino ready send data do DCA
    arduino.on('ready', function () {
      loop = setInterval(function () {
        var data = getSensorValues();
        io.sockets.emit('data', data);
        saveData(data);
      }, 1000);
    });

    //On arduino error
    arduino.on('error', function (e) {
      io.sockets.emit('disconnect');
      clearLoop(loop);
    });

    //On uncaught exception kill process
    process.on('uncaughtException', function (err) {
      io.sockets.emit('disconnect');
      clearLoop(loop);
    });
  }
};


//Save data to DCA
var saveData = function (data) {
  var rawBody = '|||8:78||bt|'+ data.button +'#|||8:1||tm|'+ data.temperature +'#|||8:3||hm|'+ data.humidity +'#|||8:61||lu|'+ data.light +'#|||8:23||ru|'+ data.noise;

  request({
    method: 'POST',
    rejectUnauthorized: false,
    url: 'http://54.232.80.217:8002/idas/2.0?apikey=5554li9m2nfj4o2qcpjeuivbpr&ID=KITiot-02',
    body: rawBody

  }, function (err, res, body) {
    if (!err) {
      if (res.statusCode === 200) {
        io.sockets.emit('internetConnection', { msg: 'Conectado na nuvem' });
        console.log('Data saved - ' + new Date());

      } else {
        io.sockets.emit('no-internetConnection', { msg: 'Erro ao salvar os dados do Kit' });
      }
    } else {
      if (err.code === 'EHOSTUNREACH') {
       io.sockets.emit('no-internetConnection', { msg: 'Sem conexão com a internet' });
      }
    }
  });
};

//Clear loop
var clearLoop = function (l) {
  clearInterval(l);
};

//Get sensor values
var getSensorValues = function () {
  var values = {
    button     : button.value,
    light      : light.value,
    noise      : noise.value,
    temperature: dht11.temperature,
    humidity   : dht11.humidity
  };

  return values;
};
