import React from "react";
import { IoAlertCircleOutline, IoCloseOutline } from "react-icons/io5";

import classes from "./alert.module.scss";

const Alert = ({ type, children, floating, onClose }) => {
  let title = null,
    icon = null,
    close = null;
  const alertClasses = [classes.Alert];

  if (floating) {
    alertClasses.push(classes.Floating);
  }

  if (onClose) {
    close = (
      <div className={classes.AlertClose} onClick={onClose}>
        <IoCloseOutline />
      </div>
    );
  }

  switch (type) {
    case "error":
      title = "Error";
      icon = <IoAlertCircleOutline />;
      alertClasses.push(classes.Error);
      break;
    default:
      break;
  }

  return (
    <div className={alertClasses.join(" ")}>
      <div className={classes.AlertIcon}>{icon}</div>
      <div className={classes.AlertMessage}>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
      {close}
    </div>
  );
};

export default Alert;
