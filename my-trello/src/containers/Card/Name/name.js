import React, { useState, useEffect, useCallback } from "react";
import { IoJournalOutline } from "react-icons/io5";

import CardHeading from "../../../components/Card/Heading/heading";
import TransparentInput from "../../../components/UI/TransparentInput/transparentInput";
import { updateObject } from "../../../util/helpers";

const Name = (props) => {
  const { name, inputSaveName } = props;
  const [nameInput, setNameInput] = useState({
    elementKey: "name",
    elementType: "input",
    elementConfig: {
      type: "text",
      required: true,
    },
    value: "",
  });

  const updateName = useCallback(
    (newName) => {
      setNameInput((prevState) => {
        return updateObject(prevState, { value: newName });
      });
    },
    [setNameInput]
  );

  useEffect(() => {
    updateName(name);
  }, [name, updateName]);

  const saveName = () => {
    const newName = nameInput.value.trim();
    if (newName !== "") {
      inputSaveName(nameInput.elementKey, newName);
    } else {
      updateName(name);
    }
  };

  return (
    <div>
      <CardHeading>
        <IoJournalOutline />
        <TransparentInput
          inputData={nameInput}
          inputChanged={(e) => updateName(e.target.value)}
          blurred={saveName}
        />
      </CardHeading>
    </div>
  );
};

export default Name;
