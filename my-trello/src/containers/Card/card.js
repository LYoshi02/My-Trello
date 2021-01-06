import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";

import { updateObject } from "../../util/helpers";
import Name from "./Name/name";
import Description from "./Description/description";
import Checklist from "../../components/Card/Sections/checklist";

import classes from "./card.module.scss";
import CardModal from "../../components/Card/Modal/modal";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const cardId = props.match.params.cardId;
  useEffect(() => {
    axios
      .get(`card/${cardId}`)
      .then((res) => {
        setCardData(res.data.card);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cardId]);

  const saveInput = (inputName, inputValue) => {
    if (cardData[inputName] !== inputValue.trim()) {
      const updatedCard = updateObject(cardData, {
        [inputName]: inputValue,
      });

      axios
        .put(`/card/${cardData._id}`, {
          card: updatedCard,
        })
        .then((res) => {
          console.log(res);
          setCardData(res.data.card);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let mainCardContent = null,
    nameCard = null;
  if (cardData) {
    nameCard = <Name name={cardData.name} inputSaveName={saveInput} />;

    mainCardContent = (
      <div className={classes.MainContent}>
        <Description
          description={cardData.description}
          inputSaveDescription={saveInput}
        />
        <Checklist />
      </div>
    );
  }

  let modal = null;
  if (openModal) {
    modal = <CardModal />;
  }

  return (
    <div className={classes.Card}>
      <div className={classes.CardHeader}>{nameCard}</div>

      <div className={classes.CardBody}>
        {mainCardContent}

        <div className={classes.Actions}>
          <div>
            <h3>Añadir a la tarjeta</h3>
            <button onClick={() => setOpenModal((prev) => !prev)}>
              Checklist
            </button>
            <button>Checklist</button>
            <button>Checklist</button>
          </div>

          <div>
            <h3>Acciones</h3>
            <button>Checklist</button>
            <button>Checklist</button>
            <button>Checklist</button>
          </div>
        </div>
      </div>

      {modal}
    </div>
  );
};

export default Card;
