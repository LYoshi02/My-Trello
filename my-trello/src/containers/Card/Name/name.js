import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    updateName(name);
  }, [name]);

  const updateName = (newName) => {
    const updatedNameInput = updateObject(nameInput, {
      value: newName,
    });
    setNameInput(updatedNameInput);
  };

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
