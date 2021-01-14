import React from "react";
import { IoCreateOutline, IoCheckmarkSharp } from "react-icons/io5";
import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import classes from "./tagSelector.module.scss";

const TagSelector = ({
  tags,
  selectedTags,
  setTagCreator,
  setTagEditor,
  closeModal,
  onSelectTag,
}) => {
  let tagElements = null;
  if (tags) {
    tagElements = tags.map((tag) => {
      const clrClass = `tag-${tag.color}`;
      return (
        <li key={tag._id} className={classes.Tag}>
          <span className={clrClass} onClick={() => onSelectTag(tag._id)}>
            {tag.name}&nbsp;
            {selectedTags.some(
              (st) => st._id.toString() === tag._id.toString()
            ) && <IoCheckmarkSharp />}
          </span>
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
