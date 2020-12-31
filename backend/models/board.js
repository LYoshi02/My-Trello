const { Schema, model } = require("mongoose");

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = model("Board", boardSchema);
