var KitIoT  = require('./lib/kit-iot'),
    update  = require('update-notifier');


//Update notifier
var notifier = update();

//Before init the kit notify about an update
if (notifier.update) {
  notifier.notify();
}

//Initiate the kit
var KitIoT = new KitIoT();

//On io connection start the arduino
KitIoT.io.on('connection', function (socket) {
  KitIoT.connect();
});

