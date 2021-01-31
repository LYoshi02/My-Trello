const { validationResult } = require("express-validator");
const uuid = require("uuid");

const Card = require("../models/card");
const List = require("../models/list");
const bucket = require("../firebaseStorage");
const { deleteBucketFile } = require("../util/file");
const { validateBoardCreator } = require("../util/board");

exports.getCard = async (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.userId;

  try {
    const card = await Card.findById(cardId)
      .populate("checklists")
      .populate("selectedTags")
      .exec();

    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    res.status(200).json({ card: card });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCard = async (req, res, next) => {
  const cardId = req.params.cardId;
  const updatedCard = req.body.card;
  const userId = req.userId;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    card = await Card.findByIdAndUpdate(cardId, updatedCard, {
      new: true,
    })
      .populate("selectedTags")
      .exec();

    res.status(200).json({ card: card });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.userId;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    const list = await List.findById(card.listId);
    if (!list) {
      throw new Error("List not found");
    }
    list.cardIds.pull(cardId);
    await list.save();

    card.attachments.forEach(async (att) => {
      if (att.type !== "link") {
        await deleteBucketFile(att.completeName);
      }
    });

    const result = await Card.findByIdAndDelete(cardId);
    res.status(200).json({ card: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.uploadFile = async (req, res, next) => {
  const filePath = `uploaded/${req.file.filename}`;
  const downloadToken = uuid.v4();
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: downloadToken,
    },
    contentType: req.file.mimetype,
    cacheControl: "public, max-age=31536000",
  };

  try {
    // Uploads a local file to the bucket
    await bucket.upload(filePath, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: metadata,
    });

    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET_NAME}/o/${req.file.filename}?alt=media&token=${downloadToken}`;
    req.attachedFileUrl = fileUrl;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createFileAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachedFileData = req.file;
  const attachedFileUrl = req.attachedFileUrl;
  const userId = req.userId;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    const shortName = attachedFileData.originalname;
    const shortNameArray = attachedFileData.originalname.split(".");
    const extension = shortNameArray[shortNameArray.length - 1];
    const newAttachment = {
      name: shortName,
      completeName: attachedFileData.filename,
      url: attachedFileUrl,
      type: extension,
    };

    card.attachments.push(newAttachment);
    await card.save();
    const result = await Card.populate(card, { path: "selectedTags" });

    res.status(201).json({ card: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createLinkAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const userId = req.userId;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    card.attachments.push({ ...req.body });
    await card.save();
    const result = await Card.populate(card, { path: "selectedTags" });

    res.status(201).json({ card: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachmentId = req.params.attachmentId;
  const userId = req.userId;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card not found");
      error.statusCode = 404;
      throw error;
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    const searchedAttachment = card.attachments.find(
      (item) => item._id.toString() === attachmentId
    );

    if (!searchedAttachment) {
      const error = new Error("Requested file not found");
      error.statusCode = 404;
      throw error;
    }

    if (searchedAttachment.type !== "link") {
      await deleteBucketFile(searchedAttachment.completeName);
    }

    card.attachments.pull(attachmentId);
    await card.save();
    const result = await Card.populate(card, { path: "selectedTags" });
    res.status(200).json({ card: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
