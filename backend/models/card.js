const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
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
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  listId: {
    type: Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  selectedTags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  attachments: [
    {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      completeName: {
        type: String,
        trim: true,
        default: "",
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

module.exports = model("Card", cardSchema);
