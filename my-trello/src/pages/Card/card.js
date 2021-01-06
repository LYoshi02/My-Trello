import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";

import { updateObject } from "../../util/helpers";
import Name from "../../components/Card/Sections/Name/name";
import Description from "../../components/Card/Sections/Description/description";

import classes from "./card.module.scss";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [editMarkdown, setEditMarkdown] = useState(false);
  const [cardInputs, setCardInputs] = useState({
    name: {
      elementKey: "name",
      elementType: "input",
      elementConfig: {
        type: "text",
        required: true,
      },
      value: "",
    },
    description: {
      elementKey: "description",
      elementType: "textarea",
      elementConfig: {
        placeholder: "Añadir una descripcion más detallada...",
        required: true,
        autoFocus: true,
      },
      value: "",
    },
  });

  const cardId = props.match.params.cardId;
  useEffect(() => {
    axios
      .get(`card/${cardId}`)
      .then((res) => {
        let updatedCardInputs = { ...cardInputs };
        for (let key in cardInputs) {
          updatedCardInputs = updateObject(updatedCardInputs, {
            [key]: updateObject(updatedCardInputs[key], {
              value: res.data.card[key] || "",
            }),
          });
        }
        setCardInputs(updatedCardInputs);
        setCardData(res.data.card);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cardId]);

  const inputChangedHanler = (event, inputName) => {
    const updatedCardInputs = updateObject(cardInputs, {
      [inputName]: updateObject(cardInputs[inputName], {
        value: event.target.value,
      }),
    });

    setCardInputs(updatedCardInputs);
  };

  const saveInput = (inputName) => {
    if (cardData[inputName] !== cardInputs[inputName].value) {
      const updatedCard = updateObject(cardData, {
        [inputName]: cardInputs[inputName].value,
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

    if (inputName === "description") {
      setEditMarkdown(false);
    }
  };

  const editMarkdownToggle = () => {
    setEditMarkdown((prevState) => !prevState);
  };

  let userCard = null;
  if (cardData) {
    userCard = (
      <div className={classes.UserCard}>
        <Name
          cardInput={cardInputs.name}
          inputChangeName={inputChangedHanler}
          inputSaveName={saveInput}
        />

        <Description
          isEditing={editMarkdown}
          description={cardData.description}
          toggleEditor={editMarkdownToggle}
          cardInput={cardInputs.description}
          inputChangeDescription={inputChangedHanler}
          inputSaveDescription={saveInput}
        />
      </div>
    );
  }

  return <div>{userCard}</div>;
};

export default Card;
