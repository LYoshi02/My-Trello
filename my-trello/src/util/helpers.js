export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const checkInputValidity = (value, rules) => {
  let isValid = true,
    message = "";

  if (isValid && rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) message = "Este campo es obligatorio";
  }

  if (isValid && rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
    if (!isValid) message = "El email ingresado no es válido";
  }

  if (isValid && rules.minLength) {
    isValid = value.trim().length >= rules.minLength && isValid;
    if (!isValid)
      message = `Este campo debe tener al menos ${rules.minLength} caracteres`;
  }

  return { isValid, message };
};
