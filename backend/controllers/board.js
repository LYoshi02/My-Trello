const { validationResult } = require("express-validator");

const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const Tag = require("../models/tag");
const { validateBoardCreator } = require("../util/board");
const { deleteFile } = require("../util/file");

exports.getBoards = async (req, res, next) => {
  const userId = req.userId;
  try {
    const boards = await Board.find({ creator: userId }).select(
      "name background"
    );

    res.status(200).json({ boards: boards });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createBoard = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { name, background } = req.body;
    const userId = req.userId;

    const board = new Board({ name, background, creator: userId });

    const defaultLists = [
      { name: "Lista de Tareas", position: 1, cardIds: [] },
      { name: "En Proceso", position: 2, cardIds: [] },
      { name: "Finalizado", position: 3, cardIds: [] },
    ];
    for await (let list of defaultLists) {
      const newList = new List({ ...list, boardId: board });
      await newList.save();
    }

    const defaultTags = [
      { name: "", color: "green", boardId: board._id.toString() },
      { name: "", color: "yellow", boardId: board._id.toString() },
      { name: "", color: "red", boardId: board._id.toString() },
      { name: "", color: "blue", boardId: board._id.toString() },
    ];
    const tags = await Tag.insertMany(defaultTags);
    board.tags = tags;
    await board.save();

    res
      .status(201)
      .json({ message: "Board created successfully", board: board });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBoard = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;

  try {
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }
    const board = await Board.findById(boardId);

    const boardLists = await List.find({ boardId: boardId })
      .populate({
        path: "cardIds",
        populate: {
          path: "selectedTags",
        },
      })
      .sort("position")
      .exec();

    res.status(200).json({ boardData: { board, lists: boardLists } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.saveCard = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const boardId = req.params.boardId;
    const userId = req.userId;
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }
    const board = await Board.findById(boardId);

    const listId = req.params.listId;
    const list = await List.findOne({ _id: listId, boardId });

    if (!list) {
      throw new Error("List not found");
    }

    const newCard = new Card({
      name: req.body.name,
      boardId: board._id,
      listId: list._id,
    });
    const result = await newCard.save();

    list.cardIds.push(result);
    await list.save();

    res.status(201).json({ card: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateListName = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const boardId = req.params.boardId;
    const userId = req.userId;
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }
    const board = await Board.findById(boardId);

    const listId = req.params.listId;
    const newName = req.body.name;
    const changedList = await List.findOne({ _id: listId, boardId });

    if (!changedList) {
      throw new Error("List not found");
    }

    changedList.name = newName;
    const updatedList = await changedList.save();

    res.status(200).json({ list: updatedList });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createList = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const boardId = req.params.boardId;
    const userId = req.userId;
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const newName = req.body.name;
    const lastList = await List.findOne({ boardId }).sort("-position").exec();
    const newPosition = lastList ? lastList.position + 1 : 1;
    const newList = new List({
      name: newName,
      position: newPosition,
      cardIds: [],
      boardId: boardId,
    });
    await newList.save();

    res.status(201).json({
      message: "New list created successfully",
      list: newList,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateLists = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;

  try {
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const updatedLists = req.body.updatedLists;
    for await (let list of updatedLists) {
      const updatedList = await List.findById(list._id);
      updatedList.cardIds = list.cardIds;
      await updatedList.save();
    }

    res.status(200).json({ message: "Lists updated successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteList = async (req, res, next) => {
  const boardId = req.params.boardId;
  const listId = req.params.listId;
  const userId = req.userId;

  try {
    const boardValidationError = await validateBoardCreator(boardId, userId);
    if (boardValidationError) {
      throw boardValidationError;
    }

    const list = await List.findOne({ _id: listId, boardId: boardId })
      .populate("cardIds")
      .exec();
    if (!list) {
      const error = new Error("Lista no encontrada");
      error.statusCode = 404;
      throw error;
    }

    list.cardIds.forEach((card) => {
      card.attachments.forEach((att) => {
        if (att.type !== "link") {
          deleteFile(att.url);
        }
      });
    });

    await Card.deleteMany({ _id: { $in: list.cardIds } });
    await List.findByIdAndDelete(listId);

    res.status(200).json({ message: "List deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
