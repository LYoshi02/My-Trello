import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { Draggable, Droppable } from "react-beautiful-dnd";

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
  const editInputRef = useRef(null);

  const openCard = (cardId) => {
    history.push(`/card/${cardId}`);
  };

  let listCards = null;
  if (listData.cardIds.length > 0) {
    listCards = listData.cardIds.map((card, index) => (
      <Draggable key={card._id} draggableId={card._id} index={index}>
        {(provided) => (
          <div
            className={classes.Card}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => openCard(card._id)}
            ref={provided.innerRef}
          >
            <p>{card.name}</p>
          </div>
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
      <div>
        <button type="button" onClick={createCard}>
          Crear Tarjeta
        </button>
        <IoCloseOutline onClick={() => setCardCreator("")} />
      </div>
    );
  }

  const checkEnterKey = (event) => {
    if (event.key === "Enter") {
      editInputRef.current.blur();
    }
  };

  return (
    <div className={classes.CardList}>
      <div className={classes.CardContent}>
        <div>
          <input
            type="text"
            defaultValue={listData.name}
            onClick={(e) =>
              e.target.setSelectionRange(0, e.target.value.length)
            }
            onBlur={editListName}
            onKeyPress={checkEnterKey}
            ref={editInputRef}
          />
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
