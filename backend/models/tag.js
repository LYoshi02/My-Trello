const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
  tags: [
    {
      name: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        required: true,
      },
    },
  ],
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
});

module.exports = model("Tag", tagSchema);
