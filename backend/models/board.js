const { Schema, model } = require("mongoose");

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  background: {
    type: Object,
    required: true,
  },
});

module.exports = model("Board", boardSchema);
