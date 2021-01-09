import React, { useState } from "react";

import TagCreator from "../../../components/Card/Sections/Tags/TagCreator/tagCreator";
import TagModal from "../../../components/Card/Sections/Tags/TagSelector/tagSelector";

const Tag = ({ isModalOpen, closeModal }) => {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tags, setTags] = useState([
    { name: "urgente", color: "red", selected: false },
    { name: "", color: "green", selected: true },
    { name: "", color: "blue", selected: false },
  ]);

  const tagCreatorHandler = (action) => {
    if (action === "create") {
      setCreating(true);
      setEditing(false);
    } else if (action === "edit") {
      setCreating(false);
      setEditing(true);
    }
  };

  const closeAllModals = () => {
    setCreating(false);
    setEditing(false);
    closeModal();
  };

  let modal = null;
  if (creating || editing) {
    modal = <TagCreator creating={creating} closeModal={closeAllModals} />;
  } else if (isModalOpen) {
    modal = (
      <TagModal
        tags={tags}
        setTagCreator={tagCreatorHandler}
        closeModal={closeAllModals}
      />
    );
  }

  return (
    <div>
      <p>Hello</p>
      {modal}
    </div>
  );
};

export default Tag;
