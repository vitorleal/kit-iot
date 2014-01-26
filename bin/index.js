#!/usr/bin/env node

var kitiot = require('../lib/kit-iot');

//Initiate the kit
var KitIoT = new kitiot();

//On io connection start the arduino
KitIoT.io.on('connection', function (socket) {
  KitIoT.connect();

  //Start sending/saving data
  socket.on('start', function () {
    KitIoT.start();
  });

  //Stop sending/saving data
  socket.on('stop', function () {
    KitIoT.clearLoop(KitIoT.loop);
  });
});
