import React from "react";
import { IoAddSharp } from "react-icons/io5";

import classes from "./tagViewer.module.scss";

const TagViewer = ({ selectedTags, openModal }) => {
  let tagElements = selectedTags.map((st) => {
    const clrClass = `tag-${st.color}`;
    return (
      <span
        key={st._id}
        className={`${clrClass} ${classes.TagElement}`}
        onClick={openModal}
      >
        {st.name}
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
