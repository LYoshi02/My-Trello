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
