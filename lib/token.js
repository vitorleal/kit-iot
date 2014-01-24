var fs   = require('fs'),
    path = require('path');

//Toekn manager
var Token = function () {
  this.file = path.resolve(__dirname, '..') + '/.token';
};

//Get token id
Token.prototype.getId = function () {
  var file;

  if (fs.existsSync(this.file)) {
    file = fs.readFileSync(this.file, 'utf8');

  } else {
    file = null;
  }
  return file;
};

//Save token
Token.prototype.saveId = function (id) {
  if (this.getId()) {
    fs.unlinkSync(this.file);
  }

  fs.writeFileSync(this.file, id);
};

module.exports = Token;
