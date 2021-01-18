import React, { useState } from "react";

import Button from "../../../components/UI/Button/button";
import { updateObject } from "../../../util/helpers";

import classes from "../auth.module.scss";

const Login = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({
    email: {
      value: "test@test.com",
    },
    password: {
      value: "12345",
    },
  });

  const submitFormHandler = (event) => {
    event.preventDefault();
    const user = {};
    for (let key in loginForm) {
      user[key] = loginForm[key].value;
    }

    onLogin(user);
  };

  const inputChangedHandler = (input, value) => {
    setLoginForm((prevState) => {
      const updatedInput = updateObject(prevState[input], { value });
      return updateObject(prevState, {
        [input]: updatedInput,
      });
    });
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Form}>
        <h2>Iniciar Sesion</h2>
        <form onSubmit={submitFormHandler}>
          <div className={classes.FormGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Tu correo"
              id="email"
              value={loginForm["email"].value}
              onChange={(e) => inputChangedHandler("email", e.target.value)}
            />
          </div>

          <div className={classes.FormGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              id="password"
              value={loginForm["password"].value}
              onChange={(e) => inputChangedHandler("password", e.target.value)}
            />
          </div>

          <Button type="submit">Iniciar sesion</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
