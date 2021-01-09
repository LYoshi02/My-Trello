import React from "react";
import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import { getTagColorsArray } from "../../../../../util/card";

import classes from "./tagCreator.module.scss";

const TagCreator = ({ creating, closeModal }) => {
  const colorsArray = getTagColorsArray();
  const colorElements = colorsArray.map((clr) => (
    <span key={clr.name} style={{ backgroundColor: clr.colorCode }}></span>
  ));

  return (
    <CardModal close={closeModal}>
      <h2>{creating ? "Crear Etiqueta" : "Cambiar Etiqueta"}</h2>

      <div>
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" />
      </div>

      <div>
        <p>Seleccionar un color</p>
        <div className={classes.Colors}>{colorElements}</div>
      </div>

      <div>
        <Button>{creating ? "Crear" : "Editar"}</Button>
      </div>
    </CardModal>
  );
};

export default TagCreator;
