import React from "react";
import {
  IoCheckmarkSharp,
  IoChevronBackOutline,
  IoCloseOutline,
} from "react-icons/io5";

import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import classes from "./tagCreator.module.scss";

const tagColors = [
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "light-blue",
  "aqua",
  "pink",
  "black",
];

const TagCreator = ({
  creating,
  closeModal,
  exitModals,
  cardName,
  cardColor,
  changeCardName,
  changeCardColor,
  tagAction,
}) => {
  const colorElements = tagColors.map((clr) => {
    const clrClass = `tag-${clr}`;
    return (
      <span
        key={clr}
        className={clrClass}
        onClick={() => changeCardColor(clr.name)}
      >
        {cardColor === clr.name ? <IoCheckmarkSharp /> : ""}
      </span>
    );
  });

  return (
    <CardModal close={exitModals}>
      <div className={classes.TagHeader}>
        <IoChevronBackOutline onClick={closeModal} />
        <h2>{creating ? "Crear Etiqueta" : "Cambiar Etiqueta"}</h2>
        <IoCloseOutline onClick={exitModals} />
      </div>

      <div>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          value={cardName}
          onChange={changeCardName}
        />
      </div>

      <div>
        <p>Seleccionar un color</p>
        <div className={classes.Colors}>{colorElements}</div>
      </div>

      <div>
        <Button type="button" clicked={tagAction}>
          {creating ? "Crear" : "Editar"}
        </Button>
      </div>
    </CardModal>
  );
};

export default TagCreator;
