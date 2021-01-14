const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
  name: {
    type: String,
    default: "",
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
});

module.exports = model("Tag", tagSchema);
