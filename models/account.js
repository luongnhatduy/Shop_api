var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var account = new Schema({
  userName: String,
  passWord: String,
  name: String,
  age: Number,
  phone: Number,
  listFavorite: Array,
  productsPurchased: [
    {
      idProduct: String,
      count: Number,
      phone: Number,
      address: String
    }
  ]
});
module.exports = mongoose.model("account", account);
