const express = require("express");
const multer = require("multer");
const uuid = require("uuid");

const cardController = require("../controllers/card");

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploaded");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid.v4()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 1000000 },
});

router.get("/card/:cardId", cardController.getCard);

router.put("/card/:cardId", cardController.updateCard);

router.delete("/card/:cardId", cardController.deleteCard);

router.post(
  "/card/:cardId/upload",
  upload.single("attachedFile"),
  cardController.createAttachment
);

module.exports = router;
