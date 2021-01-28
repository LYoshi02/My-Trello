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
          <span>tableros</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className={`${classes.Button} ${classes.ButtonRed}`}
        >
          <IoExitOutline />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    );
  }

  return (
    <nav className={classes.Navbar}>
      <h1>
        <Link to="/">My Trello</Link>
      </h1>
      {navItems}
    </nav>
  );
};

export default Navbar;
