import React from "react";

import classes from "./button.module.scss";

const Button = ({ type, clicked, children, variant, color }) => {
  const btnClasses = [classes.Button];

  if (variant === "contained" && color === "primary") {
    btnClasses.push(classes.ContainedPrimary);
  } else if (variant === "outlined" && color === "primary") {
    btnClasses.push(classes.OutlinedPrimary);
  } else if (variant === "contained" && color === "secondary") {
    btnClasses.push(classes.ContainedSecondary);
  } else {
    btnClasses.push(classes.OutlinedSecondary);
  }

  return (
    <button type={type} onClick={clicked} className={btnClasses.join(" ")}>
      {children}
    </button>
  );
};

export default Button;
