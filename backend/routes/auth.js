const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/auth/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("The name should contain at least 3 characters"),
    body("email")
      .isEmail()
      .withMessage("The email is not valid")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("The email entered already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password should contain at least 6 characters")
      .trim(),
  ],
  authController.signupUser
);

router.post(
  "/auth/login",
  [
    body("email")
      .isEmail()
      .withMessage("The email is not valid")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password should contain at least 6 characters")
      .trim(),
  ],
  authController.loginUser
);

module.exports = router;
