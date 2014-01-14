(function () {
  var init = function () {
    var socket = io.connect('', { port: 4001 });

    socket.on('data', function (data) {
      console.log(data);
    });
  };

  window.onload = init();
})();
