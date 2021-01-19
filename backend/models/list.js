const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: Number,
    required: true,
  },
  cardIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
});

module.exports = model("List", listSchema);
