const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const Tag = require("../models/tag");

exports.getBoards = async (req, res, next) => {
  const userId = req.userId;
  try {
    const boards = await Board.find({ creator: userId }).select("name");

    res.status(200).json({ boards: boards });
  } catch (err) {
    console.log(err);
  }
};

exports.createBoard = async (req, res, next) => {
  const name = req.body.name;
  const userId = req.userId;

  const defaultLists = [
    { name: "Lista de Tareas", position: 1 },
    { name: "En Proceso", position: 2 },
    { name: "Finalizado", position: 3 },
  ];

  const board = new Board({ name: name, creator: userId });
  const list = new List({ lists: defaultLists, boardId: board });

  const defaultTags = [
    { name: "", color: "green", boardId: board._id.toString() },
    { name: "", color: "yellow", boardId: board._id.toString() },
    { name: "", color: "red", boardId: board._id.toString() },
    { name: "", color: "blue", boardId: board._id.toString() },
  ];

  try {
    const tags = await Tag.insertMany(defaultTags);
    board.tags = tags;
    await board.save();
    await list.save();

    res
      .status(201)
      .json({ message: "Board created successfully", board: board });
  } catch (err) {
    console.log(err);
  }
};

exports.getBoard = async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.userId;

  try {
    const board = await Board.findById(boardId);

    if (board.creator.toString() !== userId) {
      throw new Error("Not authorized");
    }

    const boardLists = await List.findOne({ boardId: boardId })
      .populate({
        path: "lists",
        populate: {
          path: "cardIds",
          populate: {
            path: "selectedTags",
          },
        },
      })
      .exec();

    res.status(200).json({ boardData: { board, lists: boardLists } });
  } catch (err) {
    console.log(err);
  }
};

exports.saveCard = async (req, res, next) => {
  const userListId = req.params.listId;

  try {
    const list = await List.findById(userListId);

    if (!list) {
      throw new Error("List not found");
    }

    const newCard = new Card({
      name: req.body.name,
      boardId: req.body.boardId,
    });
    await newCard.save();

    const listChangedId = req.body.listChangedId;
    const listChangedIndex = list.lists.findIndex(
      (list) => list._id.toString() === listChangedId.toString()
    );

    if (listChangedIndex === -1) {
      throw new Error("List index not found");
    }

    await list.lists[listChangedIndex].cardIds.push(newCard);
    await list.save();

    res.status(201).json({ card: newCard });
  } catch (err) {
    console.log(err);
  }
};

exports.updateLists = async (req, res, next) => {
  const listId = req.params.listId;

  try {
    const userList = await List.findById(listId);
    userList.lists = req.body.updatedLists;
    await userList.save();

    res.status(200).json({ list: userList });
  } catch (err) {
    console.log(err);
  }
};

exports.createList = async (req, res, next) => {
  const boardId = req.params.boardId;
  const newName = req.body.name;

  try {
    const boardLists = await List.findOne({ boardId: boardId });

    if (!boardLists) {
      throw new Error("Lists not found");
    }

    let newPosition;
    if (boardLists.lists.length > 0) {
      newPosition = boardLists.lists[boardLists.lists.length - 1].position + 1;
    } else {
      newPosition = 1;
    }

    const newList = { name: newName, position: newPosition, cardIds: [] };
    boardLists.lists.push(newList);

    await boardLists.save();

    res.status(201).json({
      message: "New list created successfully",
      list: boardLists.lists[boardLists.lists.length - 1],
    });
  } catch (err) {
    console.log(err);
  }
};
