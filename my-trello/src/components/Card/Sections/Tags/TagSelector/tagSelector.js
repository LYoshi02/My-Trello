import React from "react";
import { IoCreateOutline } from "react-icons/io5";
import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import classes from "./tagSelector.module.scss";

const TagSelector = ({ tags, setTagCreator, closeModal }) => {
  let tagElements = null;
  if (tags) {
    tagElements = tags.map((tag) => (
      <li className={classes.Tag}>
        <span>{tag.name}&nbsp;</span>
        <IoCreateOutline onClick={() => setTagCreator("edit")} />
      </li>
    ));
  }

  return (
    <CardModal close={closeModal}>
      <h2>Etiquetas</h2>
      <ul className={classes.Tags}>{tagElements}</ul>
      <div className={classes.Action}>
        <Button type="button" clicked={() => setTagCreator("create")}>
          Crear etiqueta nueva
        </Button>
      </div>
    </CardModal>
  );
};

export default TagSelector;
