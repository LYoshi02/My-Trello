const express = require("express");

const tagController = require("../controllers/tag");

const router = express.Router();

router.get("/board/:boardId/tags", tagController.getTags);

router.post("/board/:boardId/tags", tagController.createTag);

router.patch("/board/:boardId/tags/:tagId", tagController.updateTag);

router.delete("/board/:boardId/tags/:tagId", tagController.deleteTag);

module.exports = router;
