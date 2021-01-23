import React from "react";

import classes from "./spinner.module.scss";

const Spinner = ({ color }) => {
  const spinnerClasses = [classes.Spinner];
  if (color === "primary") {
    spinnerClasses.push(classes.SpinnerPrimary);
  } else if (color === "secondary") {
    spinnerClasses.push(classes.SpinnerSecondary);
  }

  return (
    <div className={spinnerClasses.join(" ")}>
      <div className={classes.Rect1}></div>
      <div className={classes.Rect2}></div>
      <div className={classes.Rect3}></div>
      <div className={classes.Rect4}></div>
      <div className={classes.Rect5}></div>
    </div>
  );
};

export default Spinner;
