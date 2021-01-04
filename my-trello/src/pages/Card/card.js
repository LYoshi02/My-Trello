import React, { useState, useEffect } from "react";
import { IoBrowsersOutline, IoMenuOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import axios from "../../axios-instance";

import TransparentInput from "../../components/UI/TransparentInput/transparentInput";

import classes from "./card.module.scss";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [description, setDescription] = useState("");

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
    userCard = (
      <div className={classes.UserCard}>
        <div className={classes.CardName}>
          <IoBrowsersOutline />
          <TransparentInput inputValue={cardData.name} />
        </div>
        <div className={classes.CardDescription}>
          <div className={classes.CardName}>
            <IoMenuOutline />
            <h2>Description</h2>
          </div>
          <ReactMarkdown
            className={classes.CardMarkdown}
            children={cardData.description}
            linkTarget="_blank"
          />
        </div>
      </div>
    );
  }

  const descriptionChanged = (event) => {
    setDescription(event.target.value);
  };

  const saveDescription = (event) => {
    event.preventDefault();
    axios
      .patch(`/card/${cardData._id}/description`, {
        description: description,
      })
      .then((res) => {
        console.log(res);
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {userCard}

      <form onSubmit={saveDescription}>
        <textarea
          placeholder="Añadir una descripcion más detallada..."
          value={description}
          onChange={descriptionChanged}
        ></textarea>
        <br />
        <button type="submit">Guardar Descripcion</button>
      </form>
    </div>
  );
};

export default Card;
