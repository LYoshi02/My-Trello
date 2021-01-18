const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("The email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    const result = await user.save();

    res.status(201).json({ user: result });
  } catch (err) {
    console.log(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
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
    console.log(err);
  }
};
