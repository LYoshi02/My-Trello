import React from "react";
import { IoGridOutline, IoExitOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import classes from "./navbar.module.scss";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
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
  if (currentUser) {
    navItems = (
      <div>
        <Link to="/boards" className={classes.Button}>
          <IoGridOutline />
          <span>tableros</span>
        </Link>
        <button
          type="button"
          onClick={logout}
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
