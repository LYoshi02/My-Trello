import React, { useState, useEffect } from "react";

import axios from "../../../axios-instance";
import TagCreator from "../../../components/Card/Sections/Tags/TagCreator/tagCreator";
import TagModal from "../../../components/Card/Sections/Tags/TagSelector/tagSelector";
import { updateObject } from "../../../util/helpers";

import "../../../styles/tag-colors.scss";

// TODO : save the tags in the entire board
const Tag = ({ boardId, isModalOpen, closeModal }) => {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createCardName, setCreateCardName] = useState("");
  const [createCardColor, setCreateCardColor] = useState("");
  const [tags, setTags] = useState([]);

  // TODO: modificar la ruta de la request (optimizacion)
  useEffect(() => {
    axios
      .get(`board/${boardId}/tags`)
      .then((res) => {
        console.log(res);
        setTags(res.data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardId]);

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
    const newTag = { name: createCardName, color: createCardColor };
    let url = `/board/${boardId}/tags`;
    let method = "POST";
    if (!creating) {
      url = `/board/${boardId}/tags/${editingId}`;
      method = "PATCH";
    }

    axios({ url, method, data: newTag })
      .then((res) => {
        closeCreatorModal();
        setCreateCardName("");
        setCreateCardColor("");
        setTags(res.data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
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
