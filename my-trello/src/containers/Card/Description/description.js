import React, { useState, useEffect, useCallback } from "react";
import { IoMenuOutline } from "react-icons/io5";

import CardHeading from "../../../components/Card/Heading/heading";
import MarkdownEditor from "../../../components/Card/MarkdownEditor/markdownEditor";
import MarkdownViewer from "../../../components/Card/MarkdownViewer/markdownViewer";
import { updateObject } from "../../../util/helpers";

const Description = (props) => {
  const { description, inputSaveDescription } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState({
    elementKey: "description",
    elementType: "textarea",
    elementConfig: {
      placeholder: "Añadir una descripcion más detallada...",
      required: true,
      autoFocus: true,
    },
    value: "",
  });

  const updateDescription = useCallback(
    (newDescription) => {
      setDescriptionInput((prevState) => {
        return updateObject(prevState, { value: newDescription });
      });
    },
    [setDescriptionInput]
  );

  useEffect(() => {
    updateDescription(description);
  }, [description, updateDescription]);

  const saveDescription = () => {
    if (descriptionInput.value.trim() !== "") {
      inputSaveDescription(descriptionInput.elementKey, descriptionInput.value);
    }
    toggleEditor();
  };

  const toggleEditor = () => {
    setIsEditing((prevState) => !prevState);
  };

  return (
    <div>
      <CardHeading>
        <IoMenuOutline />
        <h2>Descripción</h2>
      </CardHeading>
      {isEditing ? (
        <MarkdownEditor
          descriptionInput={descriptionInput}
          descriptionChanged={(e) => updateDescription(e.target.value)}
          saveDescription={saveDescription}
          closeEditor={toggleEditor}
        />
      ) : (
        <MarkdownViewer
          description={descriptionInput.value}
          openEditor={toggleEditor}
        />
      )}
    </div>
  );
};

export default Description;
