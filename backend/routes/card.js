const express = require("express");

const cardController = require("../controllers/card");

const router = express.Router();

router.get("/card/:cardId", cardController.getCard);

router.put("/card/:cardId", cardController.updateCard);

router.delete("/card/:cardId", cardController.deleteCard);

module.exports = router;
