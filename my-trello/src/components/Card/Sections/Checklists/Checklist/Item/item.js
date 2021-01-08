import React from "react";
import TransparentInput from "../../../../../UI/TransparentInput/transparentInput";

import classes from "./item.module.scss";

const Item = ({ name, completed, check, changeName }) => {
  const itemInputConfig = {
    elementKey: "checklist-item",
    elementType: "simple-input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: name,
  };

  return (
    <div className={classes.Item}>
      <input type="checkbox" onChange={check} checked={completed} />
      <TransparentInput inputData={itemInputConfig} blurred={changeName} />
    </div>
  );
};

export default Item;
