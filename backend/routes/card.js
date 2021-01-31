const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const { body } = require("express-validator");

const cardController = require("../controllers/card");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// const fileStorage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, "");
//   },
// });

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

router.get("/card/:cardId", isAuth, cardController.getCard);

router.put(
  "/card/:cardId",
  isAuth,
  [body("card.name", "The card name cannot be empty").trim().notEmpty()],
  cardController.updateCard
);

router.delete("/card/:cardId", isAuth, cardController.deleteCard);

router.post(
  "/card/:cardId/attach-file",
  isAuth,
  upload.single("attachedFile"),
  cardController.uploadFile,
  cardController.createFileAttachment
);

router.post(
  "/card/:cardId/attach-link",
  isAuth,
  [
    body("url", "The url provided is not valid").trim().isURL(),
    body("type", "The attachment type cannot be empty").trim().notEmpty(),
  ],
  cardController.createLinkAttachment
);

router.delete(
  "/card/:cardId/attachment/:attachmentId",
  isAuth,
  cardController.deleteAttachment
);

module.exports = router;
