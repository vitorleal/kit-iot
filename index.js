var kitIOT  = require('./lib/kit-iot'),
    board   = new kitIOT.Board({ debug: false }),
    button, light, noise, dht11 = {},
    interval = 1000;

button = new kitIOT.Button({
  board: board,
  pin  : 3
});

light = new kitIOT.Sensor({
  board: board,
  pin  : 'A0'
});

noise = new kitIOT.Sensor({
  board: board,
  pin  : 'A1'
});

temp = new kitIOT.Dht11({
  board: board,
  pin  : 2
});

button.value = dht11.times = 0;
light.value  = noise.value = dht11.temperature = dht11.humidity = null;


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
  }, interval);
});


//On error show message and exit the process
board.on('error', function (err) {
  board.die(err);
});

//On uncaught exception kill process
process.on('uncaughtException', function (err) {
  var text = "Could not find your board";
  board.die(text);
});


//Send data to DCA
function sendData() {
  console.log('------------------------');
  console.log('Button: %s', button.value);
  console.log('Light: %s', light.value);
  console.log('Noise: %s', noise.value);
  console.log('Temp: %s°C e %s%', tempAverage(dht11.temperature), tempAverage(dht11.humidity));

  cleanData();
}

//Clean values
function cleanData() {
  dht11.times = button.value = 0;
  dht11.temperature = dht11.humidity = null;
}

//Calculate average temperature/humidity
function tempAverage(val) {
  var average = val / dht11.times;
  return val ? parseInt(average, 10) : null;
}
