import React, { useState, useEffect } from "react";

import axios from "../../../axios-instance";
import TagCreator from "../../../components/Card/Sections/Tags/TagCreator/tagCreator";
import TagModal from "../../../components/Card/Sections/Tags/TagSelector/tagSelector";
import TagViewer from "../../../components/Card/Sections/Tags/TagViewer/tagViewer";

import "../../../styles/tag-colors.scss";

const Tag = ({
  boardId,
  selectedTags,
  isModalOpen,
  closeModal,
  openModal,
  onSaveSelectedTag,
  onUpdateSelectedTags,
}) => {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createCardName, setCreateCardName] = useState("");
  const [createCardColor, setCreateCardColor] = useState("");
  const [tags, setTags] = useState([]);

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

  const openMainModal = () => {
    openModal("tag");
  };

  const closeAllModals = (action) => {
    closeCreatorModal();
    closeModal();
  };

  const closeCreatorModal = () => {
    setCreating(false);
    setEditingId(null);
  };

  const selectTagHandler = (tagId) => {
    const isTagSelected = selectedTags.includes(tagId);
    let updatedSelectedTags;

    if (isTagSelected) {
      updatedSelectedTags = selectedTags.filter((id) => id !== tagId);
    } else {
      updatedSelectedTags = [...selectedTags];
      const selectedTag = tags.find((tag) => tag._id.toString() === tagId);
      updatedSelectedTags.push(selectedTag);
    }
    onSaveSelectedTag("selectedTags", updatedSelectedTags);
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

  const deleteTagHandler = () => {
    axios
      .delete(`/board/${boardId}/tags/${editingId}`)
      .then((res) => {
        onUpdateSelectedTags(editingId);
        setTags(res.data.tags);
        closeCreatorModal();
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
        onDeleteTag={deleteTagHandler}
      />
    );
  } else if (isModalOpen) {
    modal = (
      <TagModal
        tags={tags}
        selectedTags={selectedTags}
        setTagCreator={tagCreatorHandler}
        setTagEditor={tagEditorHandler}
        closeModal={closeAllModals}
        onSelectTag={selectTagHandler}
      />
    );
  }

  let tagViewerElement;
  if (selectedTags.length > 0 && tags.length > 0) {
    tagViewerElement = (
      <TagViewer
        tags={tags}
        selectedTags={selectedTags}
        openModal={openMainModal}
      />
    );
  }

  return (
    <>
      {tagViewerElement}
      {modal}
    </>
  );
};

export default Tag;
