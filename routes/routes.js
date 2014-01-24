var request = require('request'),
    URL     = 'http://dca.telefonicabeta.com',
    token   = require('../lib/token');
    t       = new token();

    console.log(t.id);

var routes = function (app) {
  //Main
  app.get('/', function (req, res) {
    res.render('index.html');
  });

  //Login
  app.post('/login', function (req, res) {
    //validate the form
    req.checkBody('name',  'Nome inválido').notEmpty();
    req.checkBody('email', 'Email inválido').isEmail();
    req.checkBody('tel',   'Celular inválido').isInt().len(9, 11);
    req.checkBody('token', 'Token inválido').notEmpty().len(12, 12);

    var errors    = req.validationErrors(),
        mapErrors = req.validationErrors(true);

    if (!errors) {
      request({
        url: URL +'/m2m/v2/services/'+ req.body.token

      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

          request({
            url   : URL +'/m2m/v2/services/'+ req.body.token +'/assets/'+ req.body.token,
            method: 'PUT',
            body  : JSON.stringify({ "UserProps": [
              { "name": "nome",  "value": req.body.name },
              { "name": "email", "value": req.body.email },
              { "name": "tel",   "value": req.body.tel }
            ] })
          }, function (e, r, b) {
            //Save user token
            t.saveId(req.body.token);

            res.send(body);
          });

        } else if (!error && response.statusCode === 404) {
          res.send({
            errors   : [{ param: 'token', msg: 'Token inválido', value: req.body.token }],
            mapErrors: {
              token: { param: 'token', msg: 'Token inválido', value: req.body.token }
            }
          });

        } else {
          res.send({ error: error });
        }
      });

    } else {
      res.send({
        errors   : errors,
        mapErrors: mapErrors
      });
    }

  });


  //Save lonLat
  app.post('/lonLat', function (req, res) {

    request({
      url   : URL +'/m2m/v2/services/'+ req.body.token +'/assets/'+ req.body.token,
      method: 'PUT',
      body  : req.body.userProps
    }, function (e, r, body) {

      //Save token
      t.saveId(req.body.token);

      res.send(body);
    });

  });
};

module.exports = routes;
