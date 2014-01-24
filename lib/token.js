var fs   = require('fs'),
    path = require('path'),
    file = path.resolve(__dirname, '..') + '/.token';

console.log(file);

//Toekn manager
var Token = function () {
  this.id = this.getId();
};

//Get token id
Token.prototype.getId = function () {
  return (fs.existsSync(file)) ? fs.readFileSync(file, 'utf8') : null;
};

//Save token
Token.prototype.saveId = function (id) {
  if (this.id) {
    fs.unlinkSync(file);
  }

  fs.writeFileSync(file, id);
};


module.exports = Token;
