const User = require("../models/user");
const Place = require("../models/place");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let SECRET_KEY = "my cat says meow";

const getUsers = async (req, res) => {
  let users;

  try {
    users = await User.find();
    const places = await Place.find();
    res.status(200).json(
      users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          places: places.filter((place) => {
            return place.createdBy.toString() === user.id;
          }),
        };
      })
    );
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  console.log(req, "req");
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ error: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User Doesn't exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.status(200).json({
      message: "Login Successful",
      payload: { userId: user.id, token: token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, register, login };
