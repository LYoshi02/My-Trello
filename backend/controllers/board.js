const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");

exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find().select("name");

    res.status(200).json({ boards: boards });
  } catch (err) {
    console.log(err);
  }
};

exports.createBoard = async (req, res, next) => {
  const name = req.body.name;
  const board = new Board({ name: name });
  const defaultLists = [
    { name: "Lista de Tareas", position: 1 },
    { name: "En Proceso", position: 2 },
    { name: "Finalizado", position: 3 },
  ];

  try {
    await board.save();
    const list = new List({ lists: defaultLists, boardId: board });
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
  console.log(boardId);
  try {
    const board = await Board.findById(boardId);
    const boardLists = await List.findOne({ boardId: boardId });

    res.status(200).json({ boardData: { board, lists: boardLists.lists } });
  } catch (err) {
    console.log(err);
  }
};
