const Card = require("../models/card");
const file = require("../util/file");

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
  // TODO: delete card attached images
  const cardId = req.params.cardId;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    card.attachments.forEach((att) => {
      if (att.type !== "link") {
        file.deleteFile(att.url);
      }
    });

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

    let newAttachment;

    if (attachedFile) {
      const fileName = attachedFile.originalname;
      const fileNameArray = attachedFile.originalname.split(".");
      const extension = fileNameArray[fileNameArray.length - 1];
      newAttachment = {
        name: fileName,
        url: "\\" + attachedFile.path,
        type: extension,
      };
    } else {
      newAttachment = { ...req.body };
    }

    card.attachments.push(newAttachment);
    await card.save();
    const result = await Card.populate(card, { path: "selectedTags" });

    res.status(201).json({ card: result });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAttachment = async (req, res, next) => {
  const cardId = req.params.cardId;
  const attachmentId = req.params.attachmentId;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    const searchedAttachment = card.attachments.find(
      (item) => item._id.toString() === attachmentId
    );

    if (!searchedAttachment) {
      throw new Error("Requested file does not exist");
    }

    if (searchedAttachment.type !== "link") {
      file.deleteFile(searchedAttachment.url);
    }

    card.attachments.pull(attachmentId);
    await card.save();
    const result = await Card.populate(card, { path: "selectedTags" });
    res.status(200).json({ card: result });
  } catch (error) {
    console.log(error);
  }
};
