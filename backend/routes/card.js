const express = require("express");

const cardController = require("../controllers/card");

const router = express.Router();

router.get("/card/:cardId", cardController.getCard);

router.patch("/card/:cardId/description", cardController.saveDescription);

module.exports = router;
