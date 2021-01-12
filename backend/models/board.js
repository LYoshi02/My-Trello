const { Schema, model } = require("mongoose");

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
});

module.exports = model("Board", boardSchema);
