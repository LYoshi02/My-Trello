import React, { useState } from "react";

import ChecklistModal from "../../../components/Card/Sections/Checklists/ChecklistModal/checklistModal";
import Checklists from "../../../components/Card/Sections/Checklists/checklists";
import { updateObject } from "../../../util/helpers";

const Checklist = (props) => {
  const { closeModal, isModalOpen } = props;
  const [titleInput, setTitleInput] = useState("");
  const [createItemId, setCreateItemId] = useState(null);
  const [checklists, setChecklists] = useState([
    {
      id: 1,
      title: "Checklist1",
      items: [
        {
          id: 1,
          name: "Tarea 1",
          completed: false,
        },
        {
          id: 2,
          name: "Tarea 2",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: "Checklist2",
      items: [],
    },
  ]);

  const inputChanged = (event) => {
    setTitleInput(event.target.value);
  };

  const submitChecklist = (event) => {
    event.preventDefault();
    const newChecklist = {
      title: titleInput,
      checks: [],
    };

    // inputSaveChecklist("checklist", newChecklist);
  };

  const createItemHandler = (itemName) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl.id === createItemId
    );
    const singleChecklistUpdated = updateObject(
      checklists[checklistChangedIndex],
      {
        items: [
          ...checklists[checklistChangedIndex].items,
          {
            id: Date.now(),
            name: itemName,
            completed: false,
          },
        ],
      }
    );

    const checklistsUpdated = checklists.map((cl, index) => {
      if (index === checklistChangedIndex) {
        return singleChecklistUpdated;
      }

      return cl;
    });

    setCreateItemId(null);
    setChecklists(checklistsUpdated);
  };

  const checkItemHandler = (listId, itemId) => {
    const checklistChangedIndex = checklists.findIndex(
      (cl) => cl.id === listId
    );
    const itemChangedIndex = checklists[checklistChangedIndex].items.findIndex(
      (item) => item.id === itemId
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

    const checklistsUpdated = checklists.map((cl, index) => {
      if (index === checklistChangedIndex) {
        return singleChecklistUpdated;
      }

      return cl;
    });

    setChecklists(checklistsUpdated);
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
      />
      {modal}
    </>
  );
};

export default Checklist;
// <CardModal close={closeModal}>
//   <h2>Añadir Checklist</h2>

//   <form onSubmit={submitChecklist}>
//     <div>
//       <label htmlFor="title">Título:</label>
//       <input
//         type="text"
//         placeholder="Ingrese el título del checklist"
//         autoFocus
//         id="title"
//         value={titleInput}
//         onChange={inputChanged}
//       />
//     </div>

//     <Button type="submit">Añadir</Button>
//   </form>
// </CardModal>
