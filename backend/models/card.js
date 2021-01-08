const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  checklists: [
    {
      title: {
        type: String,
        required: true,
      },
      items: [
        {
          name: {
            type: String,
            required: true,
          },
          completed: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = model("Card", cardSchema);
