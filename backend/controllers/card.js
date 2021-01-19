const { validationResult } = require("express-validator");

const Card = require("../models/card");
const List = require("../models/list");
const file = require("../util/file");
const { validateBoardCreator } = require("../util/board");

exports.getCard = async (req, res, next) => {
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

    const card = await Card.findById(cardId)
      .populate("checklists")
      .populate("selectedTags")
      .exec();
    if (!card) {
      throw new Error("Card not found");
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
      throw new Error("Card not found");
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
      throw new Error("Card not found");
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

    card.attachments.forEach((att) => {
      if (att.type !== "link") {
        file.deleteFile(att.url);
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

exports.createAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachedFile = req.file;
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
      throw new Error("Card not found");
    }

    const boardValidationError = await validateBoardCreator(
      card.boardId,
      userId
    );
    if (boardValidationError) {
      throw boardValidationError;
    }

    let newAttachment;

    if (attachedFile) {
      const fileName = attachedFile.originalname;
      const fileNameArray = attachedFile.originalname.split(".");
      const extension = fileNameArray[fileNameArray.length - 1];
      newAttachment = {
        name: fileName,
        url: "\\" + attachedFile.path,
        type: extension,
      };
    } else {
      newAttachment = { ...req.body };
    }

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

exports.deleteAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachmentId = req.params.attachmentId;
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
      throw new Error("Card not found");
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
      throw new Error("Requested file does not exist");
    }

    if (searchedAttachment.type !== "link") {
      file.deleteFile(searchedAttachment.url);
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
