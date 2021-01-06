import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import classes from "./actionButtons.module.scss";

const ActionButtons = (props) => {
  const { btnType, btnContent, cancelAction, primaryAction } = props;

  return (
    <div className={classes.ActionButtons}>
      <button type={btnType} onClick={primaryAction}>
        {btnContent}
      </button>
      <IoCloseOutline onClick={cancelAction} />
    </div>
  );
};

export default ActionButtons;
