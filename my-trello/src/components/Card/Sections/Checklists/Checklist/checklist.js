import React from "react";
import { IoCheckboxOutline } from "react-icons/io5";

import ActionButtons from "../../../../UI/ActionButtons/actionButtons";
import Button from "../../../../UI/Button/button";
import CardHeading from "../../../Heading/heading";
import Item from "./Item/item";
import TransparentInput from "../../../../UI/TransparentInput/transparentInput";

import classes from "./checklist.module.scss";

const Checklist = ({
  title,
  items,
  addItem,
  creating,
  createItem,
  closeCreator,
  checkItem,
  changeListName,
  changeItemName,
}) => {
  const checklistNameInput = {
    elementKey: "checklist",
    elementType: "simple-input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: title,
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

  let progressPercentage = 0;
  let checkElements = null;

  if (items.length > 0) {
    const itemsCompleted = items.filter((check) => check.completed).length;
    progressPercentage = parseInt((itemsCompleted / items.length) * 100);

    checkElements = items.map((item) => (
      <Item
        key={item._id}
        completed={item.completed}
        name={item.name}
        check={() => checkItem(item._id)}
        changeName={(e) => changeItemName(item._id, e.target.value)}
      />
    ));
  }

  const checkItemName = (event) => {
    const itemName = event.target.value;
    if (itemName.trim() === "") {
      closeCreator();
    } else {
      createItem(itemName);
    }
  };

  const progressBarStyles = {
    width: `${progressPercentage}%`,
  };

  let actionButton = (
    <Button type="button" clicked={addItem}>
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
          btnContent="Añadir"
          cancelAction={closeCreator}
        />
      </>
    );
  }

  return (
    <div>
      <CardHeading>
        <IoCheckboxOutline />
        <TransparentInput
          inputData={checklistNameInput}
          blurred={changeListName}
        />
      </CardHeading>

      <div>
        <div className={classes.ProgressBarWrapper}>
          <p>{progressPercentage}%</p>
          <div className={classes.ProgressBar}>
            <span style={progressBarStyles}></span>
          </div>
        </div>

        <div>{checkElements}</div>

        <div>{actionButton}</div>
      </div>
    </div>
  );
};

export default Checklist;
