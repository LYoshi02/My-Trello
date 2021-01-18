const express = require("express");

const boardController = require("../controllers/board");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/boards", isAuth, boardController.getBoards);

router.post("/board", isAuth, boardController.createBoard);

router.get("/board/:boardId", isAuth, boardController.getBoard);

router.post("/board/:boardId", isAuth, boardController.createList);

router.post("/board/list/:listId", isAuth, boardController.saveCard);

router.patch("/board/list/:listId", isAuth, boardController.updateLists);

module.exports = router;
