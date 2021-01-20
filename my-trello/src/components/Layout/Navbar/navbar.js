import React from "react";
import { IoGridOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import classes from "./navbar.module.scss";

const Navbar = () => {
  return (
    <div className={classes.Navbar}>
      <Link to="/boards" className={classes.Button}>
        <IoGridOutline />
        tableros
      </Link>
    </div>
  );
};

export default Navbar;
