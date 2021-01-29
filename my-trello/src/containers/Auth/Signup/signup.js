import React, { useState } from "react";

import Alert from "../../../components/UI/Alert/alert";
import Button from "../../../components/UI/Button/button";
import { checkInputValidity, updateObject } from "../../../util/helpers";

import classes from "../auth.module.scss";

const Signup = ({ onSignup, loading, error }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: {
      label: "Nombre",
      elementConfig: {
        type: "text",
        placeholder: "Tu nombre",
      },
      value: "",
      validation: {
        required: true,
        minLength: 3,
      },
      valid: false,
      touched: false,
      message: "",
    },
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
      for (let key in signupForm) {
        user[key] = signupForm[key].value;
      }
      onSignup(user);
    }
  };

  const inputChangedHandler = (input, value) => {
    const validationObject = checkInputValidity(
      value,
      signupForm[input].validation
    );
    const updatedForm = updateObject(signupForm, {
      [input]: updateObject(signupForm[input], {
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

    setSignupForm(updatedForm);
    setIsFormValid(formValidity);
  };

  const formElementsArray = [];
  for (let key in signupForm) {
    formElementsArray.push({ id: key, config: signupForm[key] });
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
    errorMessage = <Alert type="error">{error}</Alert>;
  }

  return (
    <div className={classes.Container}>
      <div className={classes.ErrorMessage}>{errorMessage}</div>
      <div className={classes.Form}>
        <h2>Crear Cuenta</h2>
        <form onSubmit={submitFormHandler}>
          {form}

          <Button
            btnDisabled={!isFormValid || loading}
            color="primary"
            variant="contained"
            type="submit"
          >
            {!loading ? "Crear Cuenta" : "Creando Cuenta..."}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
