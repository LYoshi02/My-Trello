const Card = require("../models/card");
const Tag = require("../models/tag");

exports.getTags = async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const tagGroup = await Tag.findOne({ boardId });
    res.status(200).json({ tags: tagGroup.tags });
  } catch (err) {
    console.log(err);
  }
};

exports.createTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const newTag = req.body;

  try {
    const tagGroup = await Tag.findOne({ boardId });
    tagGroup.tags.push(newTag);
    await tagGroup.save();

    res.status(201).json({ tags: tagGroup.tags });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const tagId = req.params.tagId;
  const updatedTag = req.body;

  try {
    const updatedTags = await Tag.findOneAndUpdate(
      { boardId, "tags._id": tagId },
      { "tags.$.name": updatedTag.name, "tags.$.color": updatedTag.color },
      { new: true }
    );
    res.status(200).json({ tags: updatedTags.tags });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  const boardId = req.params.boardId;
  const tagId = req.params.tagId;

  try {
    const tag = await Tag.findOne({ boardId: boardId, "tags._id": tagId });

    if (!tag) {
      throw new Error("Tag not found");
    }

    tag.tags.pull(tagId);
    const result = await tag.save();

    await Card.updateMany(
      { selectedTags: tagId },
      { $pull: { selectedTags: tagId } }
    );

    res.status(200).json({ tags: result.tags });
  } catch (err) {
    console.log(err);
  }
};
