const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const {
  getUsers,
  getUsersWithPagination,
  register,
  login,
} = require("./controllers/users-controller");

const {
  addPlace,
  getPlacesByUserId,
  getAllPlaces,
  deletePlace,
  editPlace,
  getPlacesByUserIdWithPagination,
} = require("./controllers/places-controller");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ourPlaces", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// mongoose
//   .connect("mongodb://localhost:27017/ourPlaces", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     app.listen(5000, () => {
//       console.log("Server connected to port 5000 and MongoDb");
//     });
//   })
//   .catch((error) => {
//     console.log("Unable to connect to Server and/or MongoDB", error);
//   });

//Middleware

app.use(cors());
app.use(bodyParser.json());

app.get("/users", getUsers);

app.get("/usersWithPagination", getUsersWithPagination);

app.post("/register", register);

app.post("/login", login);

app.post("/addPlace", addPlace);

app.get("/places/user", getPlacesByUserId); // as a query paramter

app.get("/places", getAllPlaces);

app.delete("/places?:placeId?:userId", deletePlace); //as a query parameter

app.patch("/places/editPlace", editPlace);

app.get("/placesWithPagination", getPlacesByUserIdWithPagination);

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
