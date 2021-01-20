import React from "react";
import { IoAddOutline } from "react-icons/io5";

import ActionButtons from "../../UI/ActionButtons/actionButtons";
import Button from "../../UI/Button/button";

import classes from "./newList.module.scss";

const NewList = (props) => {
  const {
    creating,
    toggleCreating,
    newListName,
    newListNameChanged,
    createNewList,
  } = props;

  let newListContent = (
    <div className={classes.NewList}>
      <Button
        type="button"
        color="secondary"
        variant="contained"
        clicked={toggleCreating}
      >
        <IoAddOutline /> Añada otra lista
      </Button>
    </div>
  );
  if (creating) {
    newListContent = (
      <form className={classes.NewListForm} onSubmit={createNewList}>
        <div>
          <input
            type="text"
            placeholder="Introduzca el título de la lista..."
            value={newListName}
            onChange={newListNameChanged}
            autoFocus
          />
        </div>
        <ActionButtons
          btnType="submit"
          btnColor="secondary"
          btnContent="Añadir lista"
          cancelAction={toggleCreating}
        />
      </form>
    );
  }

  return <div className={classes.Container}>{newListContent}</div>;
};

export default NewList;
