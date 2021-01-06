import React from "react";
import { IoMenuOutline } from "react-icons/io5";

import Heading from "../../Heading/heading";
import MarkdownEditor from "../../MarkdownEditor/markdownEditor";
import MarkdownViewer from "../../MarkdownViewer/markdownViewer";

const Description = (props) => {
  const {
    isEditing,
    description,
    toggleEditor,
    cardInput,
    inputChangeDescription,
    inputSaveDescription,
  } = props;

  const changeDescription = (event) => {
    inputChangeDescription(event, cardInput.elementKey);
  };

  const saveDescription = () => {
    inputSaveDescription(cardInput.elementKey);
  };

  return (
    <div>
      <Heading>
        <IoMenuOutline />
        <h2>Descripción</h2>
      </Heading>
      {isEditing ? (
        <MarkdownEditor
          descriptionInput={cardInput}
          descriptionChanged={changeDescription}
          saveDescription={saveDescription}
          closeEditor={toggleEditor}
        />
      ) : (
        <MarkdownViewer description={description} openEditor={toggleEditor} />
      )}
    </div>
  );
};

export default Description;
