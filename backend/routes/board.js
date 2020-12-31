const express = require("express");

const boardController = require("../controllers/board");

const router = express.Router();

router.get("/boards", boardController.getBoards);

router.post("/board", boardController.createBoard);

router.get("/board/:boardId", boardController.getBoard);

module.exports = router;
