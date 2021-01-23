import React, { useState, useEffect } from "react";
import { IoCheckboxOutline, IoTrashOutline } from "react-icons/io5";

import ActionButtons from "../../../../UI/ActionButtons/actionButtons";
import Button from "../../../../UI/Button/button";
import CardHeading from "../../../Heading/heading";
import Item from "./Item/item";
import TransparentInput from "../../../../UI/TransparentInput/transparentInput";

import classes from "./checklist.module.scss";
import { updateObject } from "../../../../../util/helpers";

const ChecklistComponent = ({
  data,
  setCreator,
  creating,
  createItem,
  checkItem,
  changeListName,
  changeItemName,
  deleteChecklist,
  deleteItem,
}) => {
  const [listNameInput, setListNameInput] = useState({
    elementKey: "checklist",
    elementType: "input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: "",
  });

  useEffect(() => {
    setListNameInput(updateObject(listNameInput, { value: data.title }));
  }, [data.title]);

  const listNameChanged = (e) => {
    setListNameInput(updateObject(listNameInput, { value: e.target.value }));
  };

  const listNameBlurred = () => {
    const newListName = listNameInput.value.trim();
    if (newListName !== "") {
      changeListName(newListName);
    } else {
      setListNameInput(updateObject(listNameInput, { value: data.title }));
    }
  };

  const checkItemName = (event) => {
    const itemName = event.target.value.trim();
    if (itemName === "") {
      setCreator(null);
    } else {
      createItem(itemName);
    }
  };

  let progressPercentage = 0;
  let checkElements = null;
  if (data.items.length > 0) {
    const itemsCompleted = data.items.filter((check) => check.completed).length;
    progressPercentage = parseInt((itemsCompleted / data.items.length) * 100);

    checkElements = data.items.map((item) => (
      <Item
        key={item._id}
        completed={item.completed}
        name={item.name}
        check={() => checkItem(item._id)}
        changeName={(e) => changeItemName(item._id, e.target.value)}
        deleteAction={() => deleteItem(item._id)}
      />
    ));
  }
  const progressBarStyles = {
    transform: `scaleX(${progressPercentage / 100})`,
    backgroundColor: progressPercentage < 100 ? "#f05454" : "#16c79a",
  };

  const actionButtonInput = {
    elementKey: "checklist-action",
    elementType: "simple-input",
    elementConfig: {
      type: "text",
      required: true,
      autoFocus: true,
      placeholder: "Añada un elemento",
    },
    value: "",
  };

  let actionButton = (
    <Button
      type="button"
      variant="contained"
      color="primary"
      clicked={() => setCreator(data._id)}
    >
      Añada un Elemento
    </Button>
  );
  if (creating) {
    actionButton = (
      <>
        <TransparentInput
          inputData={actionButtonInput}
          blurred={checkItemName}
        />
        <ActionButtons
          btnType="button"
          btnColor="primary"
          btnContent="Añadir"
          cancelAction={() => setCreator(null)}
        />
      </>
    );
  }

  return (
    <div>
      <CardHeading>
        <IoCheckboxOutline />
        <TransparentInput
          inputData={listNameInput}
          inputChanged={listNameChanged}
          blurred={listNameBlurred}
        />
        <button
          className={classes.DeleteButton}
          type="button"
          onClick={deleteChecklist}
        >
          <IoTrashOutline />
        </button>
      </CardHeading>

      <div>
        <div className={classes.ProgressBarWrapper}>
          <p>{progressPercentage}%</p>
          <div className={classes.ProgressBar}>
            <span style={progressBarStyles}></span>
          </div>
        </div>

        <div>{checkElements}</div>

        <div className={classes.ActionButtons}>{actionButton}</div>
      </div>
    </div>
  );
};

export default ChecklistComponent;
