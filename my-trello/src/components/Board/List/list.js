import React from "react";
import { useHistory } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { Draggable, Droppable } from "react-beautiful-dnd";

import ActionButtons from "../../UI/ActionButtons/actionButtons";
import TransparentInput from "../../UI/TransparentInput/transparentInput";

import classes from "./list.module.scss";
import CardPreview from "../CardPreview/cardPreview";

const List = (props) => {
  const {
    listData,
    columnCreateCard,
    cardName,
    cardNameChanged,
    setCardCreator,
    createCard,
    editListName,
  } = props;

  const history = useHistory();

  const openCard = (cardId) => {
    history.push(`/card/${cardId}`);
  };

  let listCards = null;
  if (listData.cardIds.length > 0) {
    listCards = listData.cardIds.map((card, index) => (
      <Draggable key={card._id} draggableId={card._id} index={index}>
        {(provided) => (
          <CardPreview
            provided={provided}
            onOpenCard={() => openCard(card._id)}
            cardData={card}
          />
        )}
      </Draggable>
    ));
  }

  let cardAction = (
    <button type="button" onClick={() => setCardCreator(listData._id)}>
      <IoAddOutline />
      Añada otra tarjeta
    </button>
  );
  if (columnCreateCard.toString() === listData._id.toString()) {
    cardAction = (
      <ActionButtons
        btnType="button"
        btnContent="crear tarjeta"
        primaryAction={createCard}
        cancelAction={() => setCardCreator("")}
      />
    );
  }

  const listInputData = {
    elementType: "simple-input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: listData.name,
  };

  return (
    <div className={classes.CardList}>
      <div className={classes.CardContent}>
        <TransparentInput inputData={listInputData} blurred={editListName} />

        <div className={classes.Cards}>
          <Droppable droppableId={listData._id}>
            {(provided) => (
              <div
                className={classes.Cards}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {listCards}
                {provided.placeholder}
                {columnCreateCard.toString() === listData._id.toString() ? (
                  <div className={classes.NewCard}>
                    <textarea
                      placeholder="Introduzca un titulo para la tarea"
                      rows="3"
                      value={cardName}
                      onChange={cardNameChanged}
                      autoFocus
                    ></textarea>
                  </div>
                ) : null}
              </div>
            )}
          </Droppable>
        </div>

        <div className={classes.CardAction}>{cardAction}</div>
      </div>
    </div>
  );
};

export default List;
