var kitIoT = require('./lib/kit-iot'),
    server = new kitIoT.Server({ port: '4000' }),
    request = require('request'),
    io     = require('socket.io').listen(server.http, { log: false });

//Sensors
var loop, board, button, light, noise, dht11 = {};

//On io connection start the board
io.on('connection', function (socket) {
  connectBoard();

  //On uncaught exception kill process
  process.on('uncaughtException', function (err) {
    io.sockets.emit('disconnect');
  });
});

//Connect to the board
var connectBoard = function () {
  if (!board) {
    board  = new kitIoT.Board();
    button = new kitIoT.Button({ board: board, pin: 3 });
    light  = new kitIoT.Sensor({ board: board, pin: 'A0' });
    noise  = new kitIoT.Sensor({ board: board, pin: 'A1' });
    temp   = new kitIoT.Dht11( { board: board, pin: 2 });

    button.value = 0;

    //On read sensor
    //Button
    button.on('down', function () {
      button.value = 1;
      io.sockets.emit('button', button.value);

    }).on('up', function () {
      button.value = 0;
      io.sockets.emit('button', button.value);
    });

    //Luminosity
    light.on('read', function (e, m) {
      light.value = m;
    });

    //Noise
    noise.on('read', function (e, m) {
      noise.value = m;
    });

    //Temperature and Humidity
    temp.on('read', function (e, m) {
      if (m.temperature && m.humidity) {
        dht11.temperature = parseFloat(m.temperature);
        dht11.humidity    = parseFloat(m.humidity);
      }
    });

    //On Board ready send data do DCA
    board.on('ready', function () {
      setInterval(function () {
        var data = getSensorValues();
        io.sockets.emit('data', data);
        saveData(data);
      }, 1000);
    });
  }
};


//Save data to DCA
var saveData = function (data) {
  var rawBody = '|||8:78||bt|'+ data.button +'#|||8:1||tm|'+ data.temperature +'#|||8:3||hm|'+ data.humidity +'#|||8:61||lu|'+ data.light +'#|||8:23||ru|'+ data.noise;

  request({
    method: 'POST',
    rejectUnauthorized: false,
    url: 'http://int.dca.tid.es/idas/2.0?apikey=6ujpsnp2ea5n6e7bj68cr8804k&ID=KITiot-01',
    body: rawBody  }, function (err, res, body) {
    console.log(body);
    console.log('-------------');
  });
  console.log(rawBody);
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
