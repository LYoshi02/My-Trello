const express = require("express");
const { body } = require("express-validator");

const boardController = require("../controllers/board");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/boards", isAuth, boardController.getBoards);

router.post(
  "/board",
  isAuth,
  body("name", "The name cannot be empty").trim().notEmpty(),
  boardController.createBoard
);

router.get("/board/:boardId", isAuth, boardController.getBoard);

router.post(
  "/board/:boardId",
  isAuth,
  body("name", "The name cannot be empty").trim().notEmpty(),
  boardController.createList
);

router.patch("/board/:boardId/list", isAuth, boardController.updateLists);

router.post(
  "/board/:boardId/list/:listId",
  isAuth,
  body("name", "The name cannot be empty").trim().notEmpty(),
  boardController.saveCard
);

router.patch(
  "/board/:boardId/list/:listId",
  isAuth,
  body("name", "The name cannot be empty").trim().notEmpty(),
  boardController.updateListName
);

router.delete(
  "/board/:boardId/list/:listId",
  isAuth,
  boardController.deleteList
);

module.exports = router;
