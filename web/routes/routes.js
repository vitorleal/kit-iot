var routes = function(app) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Kit Desenvolvimento IoT' });
  });
};

module.exports = routes
