const { validationResult } = require("express-validator");

const Card = require("../models/card");
const Tag = require("../models/tag");
const { validateBoardCreator } = require("../util/board");

exports.getTags = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;

  try {
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const tagGroup = await Tag.find({ boardId });
    res.status(200).json({ tags: tagGroup });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;
  const tagBody = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const newTag = new Tag({ ...tagBody, boardId: boardId });
    const result = await newTag.save();

    res.status(201).json({ tag: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;
  const tagId = req.params.tagId;
  const updatedTag = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    let tag = await Tag.findOne({ _id: tagId, boardId });

    if (!tag) {
      throw new Error("Tag not found");
    }

    tag = await Tag.findOneAndUpdate({ _id: tagId, boardId }, updatedTag, {
      new: true,
    });

    res.status(200).json({ tag: tag });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;
  const tagId = req.params.tagId;

  try {
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const tag = await Tag.findOne({ boardId, _id: tagId });

    if (!tag) {
      throw new Error("Tag not found");
    }

    await Card.updateMany(
      { selectedTags: tagId },
      { $pull: { selectedTags: tagId } }
    );

    const result = await Tag.findOneAndDelete({ boardId, _id: tagId });

    res.status(200).json({ deletedId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
