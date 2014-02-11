var routes = function (app) {
  //Main
  app.get('/', function (req, res) {
    res.render('index.html');
  });

module.exports = routes;
