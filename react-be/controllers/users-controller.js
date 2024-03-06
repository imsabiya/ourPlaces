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

const getUsersWithPagination = async (req, res) => {
  const initialPage = req.query.initialPage;
  const initialPageCount = req.query.initialPageCount;

  try {
    let users = await User.find();
    const places = await Place.find();
    users = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        places: places.filter((place) => {
          return place.createdBy.toString() === user.id;
        }),
      };
    });

    const page = parseInt(initialPage) || 1;
    const pageSize = parseInt(initialPageCount) || 5;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedItems = users.slice(startIndex, endIndex);
    const totalPages = Math.ceil(users.length / pageSize);

    res.status(200).json({
      items: paginatedItems,
      totalItems: users.length,
      totalPages: totalPages,
      currentPage: page,
    });
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
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login Successful",
      payload: { userId: user.id, token: token },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPwd = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User Doesn't exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUsersWithPagination,
  register,
  login,
  resetPwd,
};
