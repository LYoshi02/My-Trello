import React from "react";
import { IoCheckboxOutline } from "react-icons/io5";

import ActionButtons from "../../../../UI/ActionButtons/actionButtons";
import Button from "../../../../UI/Button/button";
import CardHeading from "../../../Heading/heading";
import Item from "./Item/item";
import TransparentInput from "../../../../UI/TransparentInput/transparentInput";

import classes from "./checklist.module.scss";

const ChecklistComponent = (props) => {
  const {
    data,
    setCreator,
    creating,
    createItem,
    checkItem,
    changeListName,
    changeItemName,
    deleteChecklist,
    deleteItem,
  } = props;

  const checklistNameInput = {
    elementKey: "checklist",
    elementType: "simple-input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: data.title,
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

  const checkItemName = (event) => {
    const itemName = event.target.value;
    if (itemName.trim() === "") {
      setCreator(null);
    } else {
      createItem(itemName);
    }
  };

  const progressBarStyles = {
    width: `${progressPercentage}%`,
    backgroundColor: progressPercentage < 100 ? "#f05454" : "#16c79a",
  };

  let actionButton = (
    <Button type="button" clicked={() => setCreator(data._id)}>
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
          inputData={checklistNameInput}
          blurred={changeListName}
        />
        <Button type="button" clicked={deleteChecklist}>
          Eliminar
        </Button>
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

export default ChecklistComponent;
