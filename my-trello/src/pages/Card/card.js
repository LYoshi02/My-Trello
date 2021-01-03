import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);

  const cardId = props.match.params.cardId;

  useEffect(() => {
    axios
      .get(`card/${cardId}`)
      .then((res) => {
        console.log(res);
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let userCard = null;
  if (cardData) {
    userCard = <h2>{cardData.name}</h2>;
  }

  return (
    <div>
      {userCard}
      <p>Description....</p>
    </div>
  );
};

export default Card;
