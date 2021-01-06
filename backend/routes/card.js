const express = require("express");

const cardController = require("../controllers/card");

const router = express.Router();

router.get("/card/:cardId", cardController.getCard);

router.put("/card/:cardId", cardController.updateCard);

module.exports = router;
