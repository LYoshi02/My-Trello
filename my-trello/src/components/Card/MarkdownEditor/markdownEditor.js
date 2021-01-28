import React from "react";

import ActionButtons from "../../UI/ActionButtons/actionButtons";
import TransparentInput from "../../UI/TransparentInput/transparentInput";

import classes from "./markdownEditor.module.scss";

const MarkdownEditor = (props) => {
  const {
    descriptionInput,
    descriptionChanged,
    saveDescription,
    closeEditor,
  } = props;

  let textLines = descriptionInput.value.split("\n").length + 1;

  return (
    <div className={classes.Editor}>
      <TransparentInput
        inputData={descriptionInput}
        inputChanged={descriptionChanged}
        rows={textLines}
        blurred={saveDescription}
      />
      <ActionButtons
        btnType="button"
        btnColor="primary"
        btnContent="Guardar"
        cancelAction={closeEditor}
      />
    </div>
  );
};

export default MarkdownEditor;
