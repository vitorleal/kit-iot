var libKit  = require('./lib/kit-iot'),
    KitIoT  = new libKit(),
    pkg     = require('./package.json'),
    Insight = require('insight'),
    insight = new Insight({
      trackingCode  : 'UA-5427757-50',
      packageName   : pkg.name,
      packageVersion: pkg.version
    });

KitIoT.connect();
KitIoT.start();
insight.track('init');
