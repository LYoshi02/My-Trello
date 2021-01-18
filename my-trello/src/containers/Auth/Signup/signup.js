import React, { useState } from "react";

import Button from "../../../components/UI/Button/button";
import { updateObject } from "../../../util/helpers";

import classes from "../auth.module.scss";

const Signup = ({ onSignup }) => {
  const [signupForm, setSignupForm] = useState({
    name: {
      value: "Yoshi",
    },
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
    for (let key in signupForm) {
      user[key] = signupForm[key].value;
    }

    onSignup(user);
  };

  const inputChangedHandler = (input, value) => {
    setSignupForm((prevState) => {
      const updatedInput = updateObject(prevState[input], { value });
      return updateObject(prevState, {
        [input]: updatedInput,
      });
    });
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Form}>
        <h2>Crear Cuenta</h2>
        <form onSubmit={submitFormHandler}>
          <div className={classes.FormGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              id="name"
              value={signupForm["name"].value}
              onChange={(e) => inputChangedHandler("name", e.target.value)}
            />
          </div>

          <div className={classes.FormGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Tu correo"
              id="email"
              value={signupForm["email"].value}
              onChange={(e) => inputChangedHandler("email", e.target.value)}
            />
          </div>

          <div className={classes.FormGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              id="password"
              value={signupForm["password"].value}
              onChange={(e) => inputChangedHandler("password", e.target.value)}
            />
          </div>

          <Button type="submit">Crear cuenta</Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
