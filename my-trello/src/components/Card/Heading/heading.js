import React from "react";

import classes from "./heading.module.scss";

const CardHeading = (props) => {
  return <div className={classes.Heading}>{props.children}</div>;
};

export default CardHeading;
