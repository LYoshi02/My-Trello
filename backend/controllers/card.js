const Card = require("../models/card");

exports.getCard = async (req, res, next) => {
  const cardId = req.params.cardId;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    res.status(200).json({ card: card });
  } catch (err) {
    console.log(err);
  }
};

exports.saveDescription = async (req, res, next) => {
  const cardId = req.params.cardId;
  const updatedDescription = req.body.description;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    card.description = updatedDescription;
    await card.save();

    res.status(200).json({ card: card });
  } catch (err) {
    console.log(err);
  }
};
