import React from "react";

import Checklist from "./Checklist/checklist";

const Checklists = ({
  checklists,
  creatingId,
  createNewItem,
  setItemCreator,
  checkItemList,
  changeListName,
  changeItemName,
}) => {
  let checklistsElement = null;
  if (checklists && checklists.length > 0) {
    checklistsElement = checklists.map((cl) => (
      <Checklist
        key={cl._id}
        title={cl.title}
        items={cl.items}
        addItem={() => setItemCreator(cl._id)}
        closeCreator={() => setItemCreator(null)}
        creating={creatingId === cl._id}
        createItem={createNewItem}
        checkItem={(itemId) => checkItemList(cl._id, itemId)}
        changeListName={(e) => changeListName(cl._id, e.target.value)}
        changeItemName={(itemId, itemName) =>
          changeItemName(itemId, itemName, cl._id)
        }
      />
    ));
  }

  return <>{checklistsElement}</>;
};

export default Checklists;
