import React from "react";
import { IoAddSharp } from "react-icons/io5";

import classes from "./tagViewer.module.scss";

const TagViewer = ({ tags, selectedTags, openModal }) => {
  let tagElements = selectedTags.map((st) => {
    const tagData = tags.find((tag) => tag._id.toString() === st);
    const clrClass = `tag-${tagData.color}`;
    return (
      <span
        key={st}
        className={`${clrClass} ${classes.TagElement}`}
        onClick={openModal}
      >
        {tagData.name}
      </span>
    );
  });

  return (
    <div className={classes.TagViewer}>
      <h3>Etiquetas</h3>
      <div className={classes.Tags}>
        {tagElements}
        <span className={classes.AddTag} onClick={openModal}>
          <IoAddSharp />
        </span>
      </div>
    </div>
  );
};

export default TagViewer;
