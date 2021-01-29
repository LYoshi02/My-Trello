import React, { useState, useEffect, useCallback } from "react";
import { IoCloseOutline } from "react-icons/io5";

import TransparentInput from "../../../../../UI/TransparentInput/transparentInput";
import { updateObject } from "../../../../../../util/helpers";

import classes from "./item.module.scss";

const Item = ({ name, completed, check, changeName, deleteAction }) => {
  const [itemInput, setItemInput] = useState({
    elementKey: "checklist-item",
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Nombre del item",
      required: true,
    },
    value: "",
  });

  const changeItemValue = useCallback(
    (value) => {
      setItemInput((prevState) => {
        return updateObject(prevState, { value });
      });
    },
    [setItemInput]
  );

  useEffect(() => {
    changeItemValue(name);
  }, [name, changeItemValue]);

  const blurredInputHandler = () => {
    const value = itemInput.value.trim();

    if (value.length === 0) {
      changeItemValue(name);
    } else {
      changeName(value);
    }
  };

  return (
    <div className={classes.Item}>
      <input type="checkbox" onChange={check} checked={completed} />
      <TransparentInput
        inputData={itemInput}
        inputChanged={(e) => changeItemValue(e.target.value)}
        blurred={blurredInputHandler}
      />
      <div className={classes.Delete} onClick={deleteAction}>
        <IoCloseOutline />
      </div>
    </div>
  );
};

export default Item;
