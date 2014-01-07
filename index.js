var arduino = require('./lib/kit-iot'),
    board   = new arduino.Board({ debug: false }),
    connect = require('connect'),
    button, light, noise, dht11 = {};

button = new arduino.Button({
  board: board,
  pin  : 3
});

light = new arduino.Sensor({
  board: board,
  pin  : 'A0'
});

noise = new arduino.Sensor({
  board: board,
  pin  : 'A1'
});

temp = new arduino.Dht11({
  board: board,
  pin  : 2
});

button.value = dht11.times = 0;
light.value = noise.value = dht11.temperature = dht11.humidity = null;


//On read sensor
//Button
button.on('down', function () {
  button.value += 1;
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


//On Board ready send data do DCA
board.on('ready', function () {
  setInterval(function () {
    sendData();
  }, 1000);
});

function sendData() {
  console.log('------------------------');
  console.log('Button: %s', button.value);
  console.log('Light: %s', light.value);
  console.log('Noise: %s', noise.value);
  console.log('Temp: %s°C e %s%', tempAverage(dht11.temperature), tempAverage(dht11.humidity));

  cleanDht11();
}

function cleanDht11() {
  dht11.times = button.value = 0;
  dht11.temperature = dht11.humidity = null;
}

function tempAverage(val) {
  var average = val / dht11.times;
  return val ? parseInt(average, 10) : null;
}
