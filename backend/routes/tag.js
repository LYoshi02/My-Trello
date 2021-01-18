const express = require("express");

const tagController = require("../controllers/tag");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/board/:boardId/tags", isAuth, tagController.getTags);

router.post("/board/:boardId/tags", isAuth, tagController.createTag);

router.patch("/board/:boardId/tags/:tagId", isAuth, tagController.updateTag);

router.delete("/board/:boardId/tags/:tagId", isAuth, tagController.deleteTag);

module.exports = router;
