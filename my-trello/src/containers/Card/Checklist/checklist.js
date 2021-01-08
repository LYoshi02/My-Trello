import React, { useState, useEffect } from "react";

import ChecklistModal from "../../../components/Card/Sections/Checklists/ChecklistModal/checklistModal";
import Checklists from "../../../components/Card/Sections/Checklists/checklists";
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
    closeModal();
  };

  const createItemHandler = (itemName) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === createItemId
    );
    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [
          ...checklists[checklistChangedIndex].items,
          {
            name: itemName,
            completed: false,
          },
        ],
      }
    );
    const updatedChecklists = checklists.map((cl, index) => {
      if (index === checklistChangedIndex) {
        return singleChecklistUpdated;
      }
      return cl;
    });

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

    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [...checklists[checklistChangedIndex].items],
      }
    );
    singleChecklistUpdated.items[
      itemChangedIndex
    ].completed = !singleChecklistUpdated.items[itemChangedIndex].completed;

    const updatedChecklists = checklists.map((cl, index) => {
      if (index === checklistChangedIndex) {
        return singleChecklistUpdated;
      }

      return cl;
    });

    updateChecklists("checklists", updatedChecklists);
  };

  const changeListName = (listId, newTitle) => {
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

  const changeItemName = (itemId, itemName, listId) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl._id === listId
    );
    const itemChangedIndex = checklists[checklistChangedIndex].items.findIndex(
      (item) => item._id === itemId
    );

    const updatedItem = updateObject(
      checklists[checklistChangedIndex].items[itemChangedIndex],
      {
        name: itemName,
      }
    );
    const updatedItems = checklists[checklistChangedIndex].items.map(
      (item, index) => {
        if (index === itemChangedIndex) {
          return updatedItem;
        }

        return item;
      }
    );
    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [...updatedItems],
      }
    );

    const updatedChecklists = checklists.map((cl, index) => {
      if (index === checklistChangedIndex) {
        return singleChecklistUpdated;
      }

      return cl;
    });

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

  return (
    <>
      <Checklists
        checklists={checklists}
        creatingId={createItemId}
        createNewItem={createItemHandler}
        setItemCreator={setItemCreator}
        checkItemList={checkItemHandler}
        changeListName={changeListName}
        changeItemName={changeItemName}
      />
      {modal}
    </>
  );
};

export default Checklist;
