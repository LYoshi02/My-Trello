const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  lists: [
    {
      name: {
        type: String,
        required: true,
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
    },
  ],
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
});

module.exports = model("List", listSchema);
