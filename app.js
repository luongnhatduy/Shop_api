const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const product = require("./models/product");
const account = require("./models/account");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());

mongoose.connect(
  "mongodb+srv://luongduy:duychelsea123@cluster0-niajc.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.post("/signUp", async (req, res) => {
  const userName = item => item.userName === req.body.userName;
  const listAcc = await account.find();
  if (!listAcc.some(userName)) {
    account.insertMany(req.body).then(function(respon) {
      res.send(respon);
    });
  } else {
    res.status(422).json({
      errors: " Account already exists!!!"
    });
  }
});

app.post("/login", async (req, res) => {
  const listAcc = await account.find();

  const arrUserName = listAcc.map(i => i.userName);
  if (
    listAcc[arrUserName.indexOf(req.body.userName)] &&
    req.body.passWord ==
      listAcc[arrUserName.indexOf(req.body.userName)].passWord
  ) {
    res.send(listAcc[arrUserName.indexOf(req.body.userName)]);
  } else {
    res.status(422).json({
      errors: "User account or password is incorrect"
    });
  }
});

app.post("/addProduct", async (req, res) => {
  product.insertMany(req.body).then(function(respon) {
    res.send(respon);
  });
});

app.get("/all/:id", async (req, res) => {
  const rest = await product.find();
  const user = await account.findOne({ _id: req.params.id });
  const listIdProduct = rest.map(i => i._id.toString());

  user.listFavorite.forEach(element => {
    rest[listIdProduct.indexOf(element)] = {
      ...rest[listIdProduct.indexOf(element)]._doc,
      ...{ status: true }
    };
  });

  res.json(rest);
});

app.post("/favorite", async (req, res) => {
  const rest = await account.find({ _id: req.body.idUser });
  const idFavorite = i => i === req.body.id;

  if (rest[0].listFavorite.some(idFavorite)) {
    account
      .update(
        { _id: req.body.idUser },
        { $pull: { listFavorite: req.body.id } }
      )
      .then(() => {
        account.findOne({ _id: req.body.idUser }).then(repon => {
          res.send(repon);
        });
      });
  } else {
    account
      .update(
        { _id: req.body.idUser },
        { $push: { listFavorite: req.body.id } }
      )
      .then(() => {
        account.findOne({ _id: req.body.idUser }).then(repon => {
          res.send(repon);
        });
      });
  }
});

app.post("/buy", async (req, res) => {
  const newPurchase = {
    idProduct: req.body.idProduct,
    count: req.body.count,
    phone: req.body.phone,
    address: req.body.address
  };
  account
    .update(
      { _id: req.body.idUser },
      { $push: { productsPurchased: newPurchase } }
    )
    .then(() => {
      account.findOne({ _id: req.body.idUser }).then(repon => {
        res.send(repon);
      });
    });
});

app.get("/productsPurchased/:id", async (req, res) => {
  const rest = await product.find();
  const user = await account.findOne({ _id: req.params.id });
  const listIdProduct = rest.map(i => i._id.toString());

  const result = user.toObject().productsPurchased.map(element => {
    if (listIdProduct.indexOf(element.idProduct) !== -1) {
      return {
        ...rest[listIdProduct.indexOf(element.idProduct)]._doc,
        coupon: element
      };
    } else {
      return element;
    }
  });
  res.json(result);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
