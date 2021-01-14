const Card = require("../models/card");
const Tag = require("../models/tag");

exports.getTags = async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const tagGroup = await Tag.find({ boardId });
    res.status(200).json({ tags: tagGroup });
  } catch (err) {
    console.log(err);
  }
};

exports.createTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const tagBody = req.body;

  try {
    const newTag = new Tag({ ...tagBody, boardId: boardId });
    const result = await newTag.save();

    res.status(201).json({ tag: result });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const tagId = req.params.tagId;
  const updatedTag = req.body;

  try {
    let tag = await Tag.findOne({ _id: tagId, boardId });

    if (!tag) {
      throw new Error("Tag not found");
    }

    tag = await Tag.findOneAndUpdate({ _id: tagId, boardId }, updatedTag, {
      new: true,
    });

    res.status(200).json({ tag: tag });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const tagId = req.params.tagId;

  try {
    const tag = await Tag.findOne({ boardId, _id: tagId });

    if (!tag) {
      throw new Error("Tag not found");
    }

    await Card.updateMany(
      { selectedTags: tagId },
      { $pull: { selectedTags: tagId } }
    );

    const result = await Tag.findOneAndDelete({ boardId, _id: tagId });

    res.status(200).json({ deletedId: result._id });
  } catch (err) {
    console.log(err);
  }
};
