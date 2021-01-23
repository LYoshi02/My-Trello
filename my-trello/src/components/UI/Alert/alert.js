import React from "react";

import classes from "./alert.module.scss";

const Alert = (props) => {
  return <div className={classes.Alert}>{props.children}</div>;
};

export default Alert;
