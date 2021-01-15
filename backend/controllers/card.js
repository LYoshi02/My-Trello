const Card = require("../models/card");

exports.getCard = async (req, res, next) => {
  const cardId = req.params.cardId;

  try {
    const card = await Card.findById(cardId)
      .populate("checklists")
      .populate("selectedTags")
      .exec();
    if (!card) {
      throw new Error("Card not found");
    }

    res.status(200).json({ card: card });
  } catch (err) {
    console.log(err);
  }
};

exports.updateCard = async (req, res, next) => {
  const cardId = req.params.cardId;
  const updatedCard = req.body.card;

  try {
    const card = await Card.findByIdAndUpdate(cardId, updatedCard, {
      new: true,
    })
      .populate("selectedTags")
      .exec();

    res.status(200).json({ card: card });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  const cardId = req.params.cardId;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    const result = await Card.findByIdAndDelete(cardId);
    res.status(200).json({ card: result });
  } catch (error) {
    console.log(error);
  }
};

exports.createAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachedFile = req.file;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    const fileName = attachedFile.originalname;
    const fileNameArray = attachedFile.originalname.split(".");
    const extension = fileNameArray[fileNameArray.length - 1];
    const newAttachment = {
      name: fileName,
      url: "\\" + attachedFile.path,
      type: extension,
    };
    console.log(newAttachment);
    card.attachments.push(newAttachment);
    const result = await card.save();

    res.status(200).json({ card: result });
  } catch (error) {
    console.log(error);
  }
};
