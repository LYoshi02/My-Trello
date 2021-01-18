import React, { useState, useEffect } from "react";

import ChecklistDisplay from "../../../components/Card/Sections/Checklists/Checklist/checklist";
import ChecklistModal from "../../../components/Card/Sections/Checklists/ChecklistModal/checklistModal";
import { updateObject } from "../../../util/helpers";

const Checklist = (props) => {
  const {
    closeModal,
    isModalOpen,
    fetchedChecklists,
    updateChecklists,
  } = props;
  const [titleInput, setTitleInput] = useState("");
  const [createItemId, setCreateItemId] = useState(null);
  const [checklists, setChecklists] = useState(null);

  useEffect(() => {
    console.log(fetchedChecklists);
    setChecklists(fetchedChecklists);
  }, [fetchedChecklists]);

  const inputChanged = (event) => {
    setTitleInput(event.target.value);
  };

  const submitChecklist = (event) => {
    event.preventDefault();
    const newChecklist = { title: titleInput, items: [] };
    const updatedChecklists = [...checklists, newChecklist];
    updateChecklists("checklists", updatedChecklists);
    setTitleInput("");
    closeModal();
  };

  // TODO: Refactorizar estas funciones
  const createItemHandler = (itemName) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === createItemId
    );
    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [
          ...checklists[checklistChangedIndex].items,
          { name: itemName, completed: false },
        ],
      }
    );

    const updatedChecklists = [...checklists];
    updatedChecklists.splice(checklistChangedIndex, 1, singleChecklistUpdated);

    updateChecklists("checklists", updatedChecklists);
    setCreateItemId(null);
  };

  const checkItemHandler = (listId, itemId) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === listId
    );
    const itemChangedIndex = checklists[checklistChangedIndex].items.findIndex(
      (item) => item._id === itemId
    );

    const updatedItem = updateObject(
      checklists[checklistChangedIndex].items[itemChangedIndex],
      {
        completed: !checklists[checklistChangedIndex].items[itemChangedIndex]
          .completed,
      }
    );
    const updatedItems = [...checklists[checklistChangedIndex].items];
    updatedItems.splice(itemChangedIndex, 1, updatedItem);

    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      { items: [...updatedItems] }
    );

    const updatedChecklists = [...checklists];
    updatedChecklists.splice(checklistChangedIndex, 1, singleChecklistUpdated);

    updateChecklists("checklists", updatedChecklists);
  };

  const changeListNameHandler = (listId, newTitle) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === listId
    );

    const updatedChecklists = [...checklists];
    updatedChecklists[checklistChangedIndex] = {
      ...checklists[checklistChangedIndex],
      title: newTitle,
    };

    updateChecklists("checklists", updatedChecklists);
  };

  const changeItemNameHandler = (itemId, itemName, listId) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === listId
    );
    const itemChangedIndex = checklists[checklistChangedIndex].items.findIndex(
      (item) => item._id === itemId
    );

    if (
      checklists[checklistChangedIndex].items[itemChangedIndex].name !==
      itemName.trim()
    ) {
      const updatedItem = updateObject(
        checklists[checklistChangedIndex].items[itemChangedIndex],
        {
          name: itemName,
        }
      );
      const updatedItems = [...checklists[checklistChangedIndex].items];
      updatedItems.splice(itemChangedIndex, 1, updatedItem);

      const singleChecklistUpdated = updateObject(
        checklists[checklistChangedIndex],
        {
          items: [...updatedItems],
        }
      );

      const updatedChecklists = [...checklists];
      updatedChecklists.splice(
        checklistChangedIndex,
        1,
        singleChecklistUpdated
      );

      updateChecklists("checklists", updatedChecklists);
    }
  };

  const deleteChecklistHandler = (listId) => {
    const updatedChecklists = checklists.filter((cl) => cl._id !== listId);
    updateChecklists("checklists", updatedChecklists);
  };

  const deleteItemHandler = (listId, itemId) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === listId
    );
    const updatedItems = checklists[checklistChangedIndex].items.filter(
      (item) => item._id !== itemId
    );

    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [...updatedItems],
      }
    );

    const updatedChecklists = [...checklists];
    updatedChecklists.splice(checklistChangedIndex, 1, singleChecklistUpdated);

    updateChecklists("checklists", updatedChecklists);
  };

  const setItemCreator = (checklistId) => {
    setCreateItemId(checklistId);
  };

  let modal = null;
  if (isModalOpen) {
    modal = (
      <ChecklistModal
        close={closeModal}
        submit={submitChecklist}
        title={titleInput}
        changed={inputChanged}
      />
    );
  }

  let checklistElements = null;
  if (checklists && checklists.length > 0) {
    checklistElements = checklists.map((cl) => (
      <ChecklistDisplay
        key={cl._id}
        data={cl}
        setCreator={setItemCreator}
        creating={createItemId === cl._id}
        createItem={createItemHandler}
        checkItem={(itemId) => checkItemHandler(cl._id, itemId)}
        changeListName={(e) => changeListNameHandler(cl._id, e.target.value)}
        changeItemName={(itemId, itemName) =>
          changeItemNameHandler(itemId, itemName, cl._id)
        }
        deleteChecklist={() => deleteChecklistHandler(cl._id)}
        deleteItem={(itemId) => deleteItemHandler(cl._id, itemId)}
      />
    ));
  }

  return (
    <>
      {checklistElements}
      {modal}
    </>
  );
};

export default Checklist;
