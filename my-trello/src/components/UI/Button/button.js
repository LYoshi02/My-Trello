import React from "react";

import classes from "./button.module.scss";

const Button = ({ type, clicked, children }) => (
  <button type={type} onClick={clicked} className={classes.Button}>
    {children}
  </button>
);

export default Button;
