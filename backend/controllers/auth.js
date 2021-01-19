const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/user");

exports.signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    const result = await user.save();

    res.status(201).json({ user: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      throw new Error("The email or password entered are not correct");
    }

    const isPasswordEqual = await bcrypt.compare(password, userExists.password);
    if (!isPasswordEqual) {
      throw new Error("The email or password entered are not correct");
    }

    const token = jwt.sign(
      { email: userExists.email, userId: userExists._id.toString() },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token: token, userId: userExists._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
