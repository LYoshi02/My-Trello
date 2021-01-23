const Board = require("../models/board");

exports.validateBoardCreator = async (boardId, userId) => {
  let error = null;
  const board = await Board.findById(boardId);

  if (!board) {
    error = new Error("Tablero no encontrado");
    error.statusCode = 404;
  } else if (board.creator.toString() !== userId) {
    error = new Error("No estás autorizado a acceder a este recurso");
    error.statusCode = 401;
  }

  return error;
};
