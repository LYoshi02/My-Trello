const express = require("express");

const boardController = require("../controllers/board");

const router = express.Router();

router.get("/boards", boardController.getBoards);

router.post("/board", boardController.createBoard);

router.get("/board/:boardId", boardController.getBoard);

router.post("/board/:boardId", boardController.createList);

router.post("/board/list/:listId", boardController.saveCard);

router.patch("/board/list/:listId", boardController.updateLists);

module.exports = router;
