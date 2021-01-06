import React, { useRef } from "react";

import classes from "./transparentInput.module.scss";

const TransparentInput = (props) => {
  const { blurred, inputChanged, rows } = props;
  const { elementType, elementConfig, value } = props.inputData;
  const editInputRef = useRef(null);

  const checkEnterKey = (event) => {
    if (event.key === "Enter") {
      editInputRef.current.blur();
    }
  };

  const selectInputText = (event) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };

  let input;
  switch (elementType) {
    case "textarea":
      input = (
        <textarea
          {...elementConfig}
          value={value}
          onChange={inputChanged}
          rows={rows}
          onBlur={blurred}
        ></textarea>
      );
      break;
    case "input":
      input = (
        <input
          {...elementConfig}
          value={value}
          onChange={inputChanged}
          onClick={selectInputText}
          onBlur={blurred}
          onKeyPress={checkEnterKey}
          ref={editInputRef}
        />
      );
      break;
    case "simple-input":
      input = (
        <input
          {...elementConfig}
          defaultValue={value}
          onClick={selectInputText}
          onBlur={blurred}
          onKeyPress={checkEnterKey}
          ref={editInputRef}
        />
      );
      break;
    default:
      input = null;
      break;
  }

  return <div className={classes.TransparentInput}>{input}</div>;
};

export default TransparentInput;
