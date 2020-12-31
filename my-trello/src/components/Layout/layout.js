import React from "react";

import classes from "./layout.module.scss";

const Layout = (props) => {
  return (
    <>
      <div className={classes.Layout}>
        <p>The navbar</p>
      </div>
      {props.children}
    </>
  );
};

export default Layout;
