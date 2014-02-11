var libKit = require('./lib/kit-iot'),
    KitIoT = new libKit();

KitIoT.connect();
KitIoT.start();
