var kitIoT     = require('./lib/kit-iot'),
    compulsive = require('compulsive'),
    server     = new kitIoT.Server({ port: '4000' }),
    io         = require('socket.io').listen(server.connect, { log: false }),
    interval   = 1000;

//Sensors
var board, button, light, noise, dht11 = {};

io.on('connection', function (socket) {

  if (!board) {
    board  = new kitIoT.Board();

    button = new kitIoT.Button({ board: board, pin: 3 });
    light  = new kitIoT.Sensor({ board: board, pin: 'A0' });
    noise  = new kitIoT.Sensor({ board: board, pin: 'A1' });
    temp   = new kitIoT.Dht11({  board: board, pin: 2 });

    //Initial values
    button.value = false;
    dht11.times  = 0;
    light.value  = noise.value = dht11.temperature = dht11.humidity = null;

    //On read sensor
    //Button
    button.on('down', function () {
      button.value = true;

    }).on('up', function () {
      button.value = false;
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
        dht11.times       += 1;
        dht11.temperature += parseFloat(m.temperature);
        dht11.humidity    += parseFloat(m.humidity);
      }
    });

    //On error show message and exit the process
    board.on('error', function (err) {
      io.sockets.emit('disconnect');
      board.die(err);
    });

    //On Board ready send data do DCA
    board.on('ready', function () {
      compulsive.loop(interval, function () {
        io.sockets.emit('data', getSensorValues());
        cleanData();
      });
    });
  };



  //On uncaught exception kill process
  process.on('uncaughtException', function (err) {
    io.sockets.emit('disconnect');
    board.die("Disconnected board " + err.toString());
  });

  //Get sensors values
  function getSensorValues() {
    var values = {
      button     : button.value,
      light      : light.value,
      noise      : noise.value,
      temperature: tempAverage(dht11.temperature),
      humidity   : tempAverage(dht11.humidity)
    };

    return values;
  }

  //Clean values
  function cleanData() {
    dht11.times = 0;
    dht11.temperature = dht11.humidity = null;
  };

  //Calculate average temperature/humidity
  function tempAverage(val) {
    return val ? parseInt(val/dht11.times, 10) : null;
  };
});
