const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = model("Card", cardSchema);
