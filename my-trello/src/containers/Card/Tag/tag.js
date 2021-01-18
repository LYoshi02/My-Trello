import React, { useState, useEffect } from "react";

import axios from "../../../axios-instance";
import TagCreator from "../../../components/Card/Sections/Tags/TagCreator/tagCreator";
import TagModal from "../../../components/Card/Sections/Tags/TagSelector/tagSelector";
import TagViewer from "../../../components/Card/Sections/Tags/TagViewer/tagViewer";

const Tag = ({
  boardId,
  selectedTags,
  isModalOpen,
  closeModal,
  openModal,
  onSaveSelectedTag,
  onDeleteSelectedTags,
  onUpdateSelectedTags,
  token,
}) => {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createCardName, setCreateCardName] = useState("");
  const [createCardColor, setCreateCardColor] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    axios
      .get(`board/${boardId}/tags`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setTags(res.data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardId, token]);

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
    const isTagSelected = selectedTags.some(
      (st) => st._id.toString() === tagId
    );
    let updatedSelectedTags;

    if (isTagSelected) {
      updatedSelectedTags = selectedTags.filter(
        (st) => st._id.toString() !== tagId
      );
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

    axios({
      url,
      method,
      data: newTag,
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (creating) {
          setTags((prevState) => [...prevState, res.data.tag]);
        } else {
          const updatedTagIndex = tags.findIndex(
            (tag) => tag._id.toString() === editingId
          );
          const updatedTags = [...tags];
          updatedTags.splice(updatedTagIndex, 1, res.data.tag);
          setTags(updatedTags);
          onUpdateSelectedTags(res.data.tag);
        }
        closeCreatorModal();
        setCreateCardName("");
        setCreateCardColor("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTagHandler = () => {
    axios
      .delete(`/board/${boardId}/tags/${editingId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        onDeleteSelectedTags(res.data.deletedId);
        setTags((prevState) =>
          prevState.filter((tag) => tag._id.toString() !== res.data.deletedId)
        );
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
      <TagViewer selectedTags={selectedTags} openModal={openMainModal} />
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
