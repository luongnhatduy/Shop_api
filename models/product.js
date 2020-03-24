var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var product = new Schema({
  name : String,
  thumbnail: String,
  description: String,
  price: String,
  status : Boolean
});
module.exports = mongoose.model("product", product);
