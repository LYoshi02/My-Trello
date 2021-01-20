import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import Button from "../Button/button";

import classes from "./actionButtons.module.scss";

const ActionButtons = (props) => {
  const { btnType, btnColor, btnContent, cancelAction, primaryAction } = props;

  return (
    <div className={classes.ActionButtons}>
      <Button
        color={btnColor}
        variant="contained"
        type={btnType}
        clicked={primaryAction}
      >
        {btnContent}
      </Button>
      <IoCloseOutline onClick={cancelAction} />
    </div>
  );
};

export default ActionButtons;
