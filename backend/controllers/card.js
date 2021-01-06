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

exports.updateCard = (req, res, next) => {
  const cardId = req.params.cardId;
  const card = req.body.card;

  Card.findByIdAndUpdate(cardId, card)
    .then((result) => {
      res.status(200).json({ card: card });
    })
    .catch((err) => {
      throw new Error("Card not found");
    });
};
