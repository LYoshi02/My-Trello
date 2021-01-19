const Board = require("../models/board");

exports.validateBoardCreator = async (boardId, userId) => {
  let error = null;
  const board = await Board.findById(boardId);

  if (!board) {
    error = new Error("Board not found");
    error.statusCode = 404;
  } else if (board.creator.toString() !== userId) {
    error = new Error("Not authorized");
    error.statusCode = 401;
  }

  return error;
};
