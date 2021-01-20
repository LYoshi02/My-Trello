import React from "react";
import { useHistory } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { Draggable, Droppable } from "react-beautiful-dnd";

import ActionButtons from "../../UI/ActionButtons/actionButtons";
import Button from "../../UI/Button/button";
import CardPreview from "../CardPreview/cardPreview";
import TransparentInput from "../../UI/TransparentInput/transparentInput";

import classes from "./list.module.scss";

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
        {(provided, snapshot) => (
          <CardPreview
            provided={provided}
            onOpenCard={() => openCard(card._id)}
            cardData={card}
            isDragging={snapshot.isDragging}
          />
        )}
      </Draggable>
    ));
  }

  let cardAction = (
    <Button
      type="button"
      color="primary"
      variant="outlined"
      clicked={() => setCardCreator(listData._id)}
    >
      <IoAddSharp />
      Añada otra tarjeta
    </Button>
  );
  if (columnCreateCard.toString() === listData._id.toString()) {
    cardAction = (
      <ActionButtons
        btnType="button"
        btnColor="primary"
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
