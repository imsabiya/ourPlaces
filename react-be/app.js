console.log("do it");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { getUsers, register, login } = require("./controllers/users-controller");

const {
  addPlace,
  getPlacesByUserId,
} = require("./controllers/places-controller");

const app = express();

// connect to mongoDB

mongoose
  .connect("mongodb://localhost:27017/ourPlaces", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server connected to port 5000 and MongoDb");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });

//Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/users", getUsers);

app.post("/register", register);

app.post("/login", login);

app.post("/addPlace", addPlace);

app.get("/places/user/:uid", getPlacesByUserId);
