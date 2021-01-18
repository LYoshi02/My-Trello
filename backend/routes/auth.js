const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.put("/auth/signup", authController.signupUser);

router.post("/auth/login", authController.loginUser);

module.exports = router;
