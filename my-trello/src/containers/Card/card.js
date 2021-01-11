import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";

import Actions from "../../components/Card/Actions/actions";
import Checklist from "./Checklist/checklist";
import Description from "./Description/description";
import Name from "./Name/name";
import { updateObject } from "../../util/helpers";

import classes from "./card.module.scss";
import Tag from "./Tag/tag";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [activeModal, setActiveModal] = useState("");

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
    if (!cardData[inputName] || cardData[inputName] !== inputValue) {
      const updatedCard = updateObject(cardData, {
        [inputName]: inputValue,
      });
      console.log(updatedCard);
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

  const changeActiveModal = (activeModal) => {
    setActiveModal(activeModal);
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
        <Checklist
          closeModal={() => changeActiveModal(null)}
          isModalOpen={activeModal === "checklist"}
          fetchedChecklists={cardData.checklists}
          updateChecklists={saveInput}
        />
        <Tag
          fetchedTags={cardData.tags}
          isModalOpen={activeModal === "tag"}
          closeModal={() => changeActiveModal(null)}
          updateTags={saveInput}
        />
      </div>
    );
  }

  return (
    <div className={classes.Card}>
      <div className={classes.CardHeader}>{nameCard}</div>

      <div className={classes.CardBody}>
        {mainCardContent}

        <Actions toggleModal={changeActiveModal} />
      </div>
    </div>
  );
};

export default Card;
