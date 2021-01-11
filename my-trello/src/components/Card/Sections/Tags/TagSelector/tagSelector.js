import React from "react";
import { IoCreateOutline } from "react-icons/io5";
import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import classes from "./tagSelector.module.scss";

const TagSelector = ({ tags, setTagCreator, setTagEditor, closeModal }) => {
  let tagElements = null;
  if (tags) {
    tagElements = tags.map((tag) => {
      const clrClass = `tag-${tag.color}`;

      return (
        <li key={tag._id} className={classes.Tag}>
          <span className={clrClass}>{tag.name}&nbsp;</span>
          <IoCreateOutline onClick={() => setTagEditor(tag._id)} />
        </li>
      );
    });
  }

  return (
    <CardModal close={closeModal}>
      <h2>Etiquetas</h2>
      <ul className={classes.Tags}>{tagElements}</ul>
      <div className={classes.Action}>
        <Button type="button" clicked={setTagCreator}>
          Crear etiqueta nueva
        </Button>
      </div>
    </CardModal>
  );
};

export default TagSelector;
