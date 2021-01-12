const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const boardRoutes = require("./routes/board");
const cardRoutes = require("./routes/card");
const tagRoutes = require("./routes/tag");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json());

app.use(boardRoutes);
app.use(cardRoutes);
app.use(tagRoutes);

mongoose
  .connect(
    "mongodb+srv://yoshi:kiNeAOg2V5oPvWxB@cluster0.z4xmb.mongodb.net/react-trello?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
