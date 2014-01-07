var arduino = require('./lib/kit-iot'),
    board   = new arduino.Board({ debug: false }),
    connect = require('connect');

var button = new arduino.Button({
  board: board,
  pin  : 3
});

var luz = new arduino.Sensor({
  board: board,
  pin  : 'A0'
});

var spk = new arduino.Sensor({
  board: board,
  pin  : 'A1'
});

var temp = new arduino.Dht11({
  board: board,
  pin  : 2
});

luz.val = spk.val = temp.val = null;

luz.on('read', function (e, m) {
  luz.val = m;
});

spk.on('read', function (e, m) {
  spk.val = m;
});

temp.on('read', function (e, m) {
  temp.val = m;
  console.log(m);
});

board.on('ready', function() {
  setInterval(function () {
    console.log('Luz: %s', luz.val);
    console.log('Spk: %s', spk.val);
    console.log('Temp: %s', temp.val);
  }, 500);
});
