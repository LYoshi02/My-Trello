import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IoAddSharp, IoTrashOutline } from "react-icons/io5";
import { Draggable, Droppable } from "react-beautiful-dnd";

import ActionButtons from "../../UI/ActionButtons/actionButtons";
import Button from "../../UI/Button/button";
import CardPreview from "../CardPreview/cardPreview";
import Spinner from "../../UI/Spinner/spinner";
import TransparentInput from "../../UI/TransparentInput/transparentInput";
import { updateObject } from "../../../util/helpers";

import classes from "./list.module.scss";

const List = ({
  listData,
  isCreatingCard,
  cardName,
  cardNameChanged,
  setCardCreator,
  createCard,
  editListName,
  reqCardLoading,
  onDeleteList,
}) => {
  const [listInput, setListInput] = useState({
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Tu correo",
    },
    value: "",
  });
  const history = useHistory();

  useEffect(() => {
    setListName(listData.name);
  }, [listData.name]);

  const openCard = (cardId) => {
    history.push(`/card/${cardId}`);
  };

  const listNameChanged = (event) => {
    setListName(event.target.value);
  };

  const setListName = (value) => {
    setListInput(updateObject(listInput, { value }));
  };

  const editNameHandler = () => {
    if (listInput.value !== "" && listInput.value !== listData.name) {
      editListName(listInput.value);
    } else {
      setListName(listData.name);
    }
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
  if (isCreatingCard && reqCardLoading) {
    cardAction = <Spinner color="primary" />;
  } else if (isCreatingCard) {
    cardAction = (
      <form className={classes.NewCard} onSubmit={createCard}>
        <textarea
          placeholder="Introduzca un titulo para la tarjeta"
          rows="3"
          value={cardName}
          onChange={cardNameChanged}
          autoFocus
        ></textarea>
        <ActionButtons
          btnType="submit"
          btnColor="primary"
          btnContent="crear tarjeta"
          cancelAction={() => setCardCreator("")}
        />
      </form>
    );
  }

  return (
    <div className={classes.List}>
      <div className={classes.ListContent}>
        <div className={classes.ListHeader}>
          <TransparentInput
            inputChanged={listNameChanged}
            inputData={listInput}
            blurred={editNameHandler}
          />
          <IoTrashOutline onClick={onDeleteList} />
        </div>

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
              </div>
            )}
          </Droppable>
        </div>

        <div className={classes.ListAction}>{cardAction}</div>
      </div>
    </div>
  );
};

export default List;
