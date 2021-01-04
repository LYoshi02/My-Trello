import React, { useRef } from "react";

import classes from "./transparentInput.module.scss";

const TransparentInput = (props) => {
  const { inputValue, blurred } = props;
  const editInputRef = useRef(null);

  const checkEnterKey = (event) => {
    if (event.key === "Enter") {
      editInputRef.current.blur();
    }
  };

  const selectInputText = (event) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };

  return (
    <div className={classes.TransparentInput}>
      <input
        type="text"
        defaultValue={inputValue}
        onClick={selectInputText}
        onBlur={blurred}
        onKeyPress={checkEnterKey}
        ref={editInputRef}
      />
    </div>
  );
};

export default TransparentInput;
