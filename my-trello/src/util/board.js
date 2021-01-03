export const copyUserListsArray = (userLists) => {
  const listsCopy = userLists.lists.map((list) => {
    const newCardIds = [...list.cardIds];
    const newList = {
      ...list,
      cardIds: newCardIds,
    };

    return newList;
  });

  const userListsCopy = {
    ...userLists,
    lists: listsCopy,
  };

  return userListsCopy;
};
