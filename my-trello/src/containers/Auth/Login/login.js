import React, { useState } from "react";

import Button from "../../../components/UI/Button/button";
import { updateObject, checkInputValidity } from "../../../util/helpers";

import classes from "../auth.module.scss";

const Login = ({ onLogin, loading, error }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: {
      label: "Correo Electrónico",
      elementConfig: {
        type: "email",
        placeholder: "Tu correo",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
      message: "",
    },
    password: {
      label: "Contraseña",
      elementConfig: {
        type: "password",
        placeholder: "Tu contraseña",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
      message: "",
    },
  });

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (isFormValid) {
      const user = {};
      for (let key in loginForm) {
        user[key] = loginForm[key].value;
      }

      onLogin(user);
    }
  };

  const inputChangedHandler = (input, value) => {
    const validationObject = checkInputValidity(
      value,
      loginForm[input].validation
    );
    const updatedForm = updateObject(loginForm, {
      [input]: updateObject(loginForm[input], {
        value,
        valid: validationObject.isValid,
        message: validationObject.message,
        touched: true,
      }),
    });

    let formValidity = true;
    for (let key in updatedForm) {
      formValidity = updatedForm[key].valid && formValidity;
    }

    setLoginForm(updatedForm);
    setIsFormValid(formValidity);
  };

  const formElementsArray = [];
  for (let key in loginForm) {
    formElementsArray.push({ id: key, config: loginForm[key] });
  }

  let form = formElementsArray.map((formElement) => {
    const {
      label,
      elementConfig,
      value,
      valid,
      touched,
      message,
    } = formElement.config;
    const isError = !valid && touched;
    const elementClasses = [classes.FormGroup];

    if (isError) elementClasses.push(classes.FormGroupError);

    return (
      <div className={elementClasses.join(" ")} key={formElement.id}>
        <label htmlFor={formElement.id}>{label}</label>
        <input
          {...elementConfig}
          id={formElement.id}
          value={value}
          onBlur={(e) => inputChangedHandler(formElement.id, e.target.value)}
          onChange={(e) => inputChangedHandler(formElement.id, e.target.value)}
        />
        {isError && <span>{message}</span>}
      </div>
    );
  });

  let errorMessage = null;
  if (error) {
    errorMessage = <div className={classes.ErrorMessage}>{error}</div>;
  }

  return (
    <div className={classes.Container}>
      {errorMessage}
      <div className={classes.Form}>
        <h2>Iniciar Sesion</h2>
        <form onSubmit={submitFormHandler}>
          {form}

          <Button
            btnDisabled={!isFormValid || loading}
            color="primary"
            variant="contained"
            type="submit"
          >
            {!loading ? "Iniciar sesion" : "Autenticando..."}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
