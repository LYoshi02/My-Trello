const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

module.exports = model("Token", tokenSchema);
