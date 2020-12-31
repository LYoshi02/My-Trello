const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = model("Card", cardSchema);
