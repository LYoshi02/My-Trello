import React from "react";
import { IoGridOutline, IoExitOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

import classes from "./navbar.module.scss";

const Navbar = ({ isAuth, onLogout }) => {
  let navItems = (
    <div>
      <NavLink
        to="/login"
        className={classes.Link}
        activeClassName={classes.ActiveLink}
      >
        Iniciar Sesión
      </NavLink>
      <NavLink
        to="/signup"
        className={classes.Link}
        activeClassName={classes.ActiveLink}
      >
        Crear Cuenta
      </NavLink>
    </div>
  );
  if (isAuth) {
    navItems = (
      <div>
        <Link to="/boards" className={classes.Button}>
          <IoGridOutline />
          tableros
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={`${classes.Button} ${classes.ButtonRed}`}
        >
          <IoExitOutline />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className={classes.Navbar}>
      <p>Logo</p>
      {navItems}
    </div>
  );
};

export default Navbar;
