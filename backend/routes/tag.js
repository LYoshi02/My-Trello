const express = require("express");
const { body } = require("express-validator");

const tagController = require("../controllers/tag");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/board/:boardId/tags", isAuth, tagController.getTags);

router.post(
  "/board/:boardId/tags",
  isAuth,
  body("color", "The tag color cannot be empty").trim().notEmpty(),
  tagController.createTag
);

router.patch(
  "/board/:boardId/tags/:tagId",
  isAuth,
  body("color", "The tag color cannot be empty").trim().notEmpty(),
  tagController.updateTag
);

router.delete("/board/:boardId/tags/:tagId", isAuth, tagController.deleteTag);

module.exports = router;
