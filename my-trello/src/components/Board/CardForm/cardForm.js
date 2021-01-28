import React, { useRef } from "react";

import ActionButtons from "../../UI/ActionButtons/actionButtons";

import classes from "./cardForm.module.scss";

const CardForm = ({
  onCreateCard,
  cardName,
  onCardNameChanged,
  onToggleCreator,
}) => {
  const inputRef = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    onCreateCard();
    inputRef.current.focus();
  };

  return (
    <form className={classes.NewCard} onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Introduzca un titulo para la tarjeta"
        value={cardName}
        onChange={onCardNameChanged}
        ref={inputRef}
        autoFocus
      />
      <ActionButtons
        btnType="submit"
        btnColor="primary"
        btnContent="crear tarjeta"
        cancelAction={onToggleCreator}
      />
    </form>
  );
};

export default CardForm;
