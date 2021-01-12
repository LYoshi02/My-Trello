const Tag = require("../models/tag");

exports.getTags = async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const tagGroup = await Tag.findOne({ boardId });
    res.json({ tags: tagGroup.tags });
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

    res.json({ tags: tagGroup.tags });
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
    res.json({ tags: updatedTags.tags });
  } catch (err) {
    console.log(err);
  }
};
