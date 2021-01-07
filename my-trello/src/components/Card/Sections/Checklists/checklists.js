import React from "react";

import Checklist from "./Checklist/checklist";

const Checklists = ({
  checklists,
  creatingId,
  createNewItem,
  setItemCreator,
  checkItemList,
}) => {
  const checklistsElement = checklists.map((cl) => (
    <Checklist
      key={cl.id}
      title={cl.title}
      items={cl.items}
      addItem={() => setItemCreator(cl.id)}
      closeCreator={() => setItemCreator(null)}
      creating={creatingId === cl.id}
      createItem={createNewItem}
      checkItem={(itemId) => checkItemList(cl.id, itemId)}
    />
  ));

  return <>{checklistsElement}</>;
};

export default Checklists;
