import React from "react";
import { IoBrowsersOutline } from "react-icons/io5";

import CardHeading from "../../Heading/heading";
import TransparentInput from "../../../UI/TransparentInput/transparentInput";

const Name = (props) => {
  const { cardInput, inputChangeName, inputSaveName } = props;

  const changeName = (event) => {
    inputChangeName(event, cardInput.elementKey);
  };

  const saveName = () => {
    inputSaveName(cardInput.elementKey);
  };

  return (
    <div>
      <CardHeading>
        <IoBrowsersOutline />
        <TransparentInput
          inputData={cardInput}
          inputChanged={changeName}
          blurred={saveName}
        />
      </CardHeading>
    </div>
  );
};

export default Name;
