const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Token = require("../models/token");
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../util/token");

exports.signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Los campos ingresados no son válidos");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("El correo ingresado ya se encuentra en uso");
      error.statusCode = 401;
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
      const error = new Error("Los campos ingresados no son válidos");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      const error = new Error(
        "El correo o la contraseña ingresados no son correctos"
      );
      error.statusCode = 401;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, userExists.password);
    if (!isPasswordEqual) {
      const error = new Error(
        "El correo o la contraseña ingresados no son correctos"
      );
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      email: userExists.email,
      name: userExists.name,
      userId: userExists._id.toString(),
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const token = new Token({ token: refreshToken });
    await token.save();

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: { email: userExists.email, name: userExists.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserData = (req, res, next) => {
  const token = req.body.token;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        const error = new Error("Token not valid");
        error.statusCode = 403;
        throw error;
      }

      res.status(200).json({ user: { name: user.name, email: user.email } });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logoutUser = async (req, res, next) => {
  const token = req.body.token;

  try {
    const searchedToken = await Token.findOne({ token });
    if (!searchedToken) {
      const error = new Error("Token not found");
      error.statusCode = 404;
      throw error;
    }

    await Token.deleteOne({ token });
    res.sendStatus(204);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  try {
    if (refreshToken == null) return res.sendStatus(401);

    const tokenExists = await Token.findOne({ token: refreshToken });
    if (!tokenExists) {
      const error = new Error("Token not found");
      error.statusCode = 404;
      throw error;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        const error = new Error("The token is not valid");
        error.statusCode = 403;
        throw error;
      }

      const tokenPayload = {
        email: user.email,
        name: user.name,
        userId: user.userId,
      };
      const accessToken = generateAccessToken(tokenPayload);
      res.status(201).json({
        token: accessToken,
        user: { email: user.email, name: user.name },
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
