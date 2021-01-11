import React, { useState, useEffect } from "react";

import TagCreator from "../../../components/Card/Sections/Tags/TagCreator/tagCreator";
import TagModal from "../../../components/Card/Sections/Tags/TagSelector/tagSelector";
import { updateObject } from "../../../util/helpers";

import "../../../styles/tag-colors.scss";

// TODO : save the tags in the entire board
const Tag = ({ fetchedTags, isModalOpen, closeModal, updateTags }) => {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createCardName, setCreateCardName] = useState("");
  const [createCardColor, setCreateCardColor] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTags(fetchedTags);
  }, [fetchedTags]);

  const tagCreatorHandler = () => {
    setCreating(true);
    setEditingId(null);
    setCreateCardName("");
    setCreateCardColor("");
  };

  const tagEditorHandler = (tagId) => {
    const tagSelected = tags.find(
      (tag) => tag._id.toString() === tagId.toString()
    );
    if (tagSelected) {
      setCreateCardName(tagSelected.name);
      setCreateCardColor(tagSelected.color);
      setCreating(false);
      setEditingId(tagSelected._id);
    }
  };

  const cardNameHandler = (event) => {
    setCreateCardName(event.target.value);
  };

  const cardColorHandler = (color) => {
    setCreateCardColor(color);
  };

  const closeAllModals = (action) => {
    closeCreatorModal();
    closeModal();
  };

  const closeCreatorModal = () => {
    setCreating(false);
    setEditingId(null);
  };

  const tagActionHandler = () => {
    let updatedTags = [...tags];
    const newTag = { name: createCardName, color: createCardColor };

    if (creating) {
      updatedTags.push(newTag);
    } else {
      const updatedTagIndex = tags.findIndex(
        (tag) => tag._id.toString() === editingId
      );
      const updatedTag = updateObject(tags[updatedTagIndex], newTag);
      updatedTags.splice(updatedTagIndex, 1, updatedTag);
    }

    console.log(updatedTags);
    closeCreatorModal();
    setCreateCardName("");
    setCreateCardColor("");
    updateTags("tags", updatedTags);
  };

  let modal = null;
  if (creating || editingId) {
    modal = (
      <TagCreator
        creating={creating}
        cardName={createCardName}
        changeCardName={cardNameHandler}
        cardColor={createCardColor}
        changeCardColor={cardColorHandler}
        closeModal={closeCreatorModal}
        exitModals={closeAllModals}
        tagAction={tagActionHandler}
      />
    );
  } else if (isModalOpen) {
    modal = (
      <TagModal
        tags={tags}
        setTagCreator={tagCreatorHandler}
        setTagEditor={tagEditorHandler}
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
