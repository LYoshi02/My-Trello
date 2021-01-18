import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";
import { DragDropContext } from "react-beautiful-dnd";

import List from "../../components/Board/List/list";
import NewList from "../../components/Board/NewList/newList";
import { copyUserListsArray, isMovementEqual } from "../../util/board";

import classes from "./board.module.scss";

const Board = (props) => {
  const [userLists, setUserLists] = useState(null);
  const [cardName, setCardName] = useState("");
  const [columnCreateCard, setColumnCreateCard] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [listName, setListName] = useState("");

  const { boardId } = props.match.params;
  const { token } = props;
  useEffect(() => {
    console.log("Hello");
    axios
      .get(`board/${boardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setUserLists(res.data.boardData.lists);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [boardId, token]);

  const dragEndHandler = (result) => {
    if (!result.destination || !result.source) return;

    if (!isMovementEqual(result)) {
      console.log(result);
      const startIndex = userLists.lists.findIndex(
        (list) => list._id.toString() === result.source.droppableId
      );
      const finishIndex = userLists.lists.findIndex(
        (list) => list._id.toString() === result.destination.droppableId
      );
      const draggedItem = userLists.lists[startIndex].cardIds.find(
        (card) => card._id.toString() === result.draggableId
      );
      let updatedList;

      if (startIndex === finishIndex) {
        const newCardIds = Array.from(userLists.lists[startIndex].cardIds);
        newCardIds.splice(result.source.index, 1);
        newCardIds.splice(result.destination.index, 0, draggedItem);
        const newColumn = {
          ...userLists.lists[startIndex],
          cardIds: [...newCardIds],
        };
        updatedList = {
          ...userLists,
          lists: [...userLists.lists],
        };
        updatedList.lists[startIndex] = newColumn;
      } else {
        const startCardIds = Array.from(userLists.lists[startIndex].cardIds);
        startCardIds.splice(result.source.index, 1);

        const newStartColumn = {
          ...userLists.lists[startIndex],
          cardIds: [...startCardIds],
        };

        const finishCardIds = Array.from(userLists.lists[finishIndex].cardIds);
        finishCardIds.splice(result.destination.index, 0, draggedItem);

        const newFinishColumn = {
          ...userLists.lists[finishIndex],
          cardIds: [...finishCardIds],
        };

        updatedList = {
          ...userLists,
          columns: {
            ...userLists.columns,
          },
        };
        updatedList.lists[startIndex] = newStartColumn;
        updatedList.lists[finishIndex] = newFinishColumn;
      }
      updateUserLists(updatedList);
    }
  };

  const updateUserLists = (userLists) => {
    setUserLists(userLists);

    axios
      .patch(
        `board/list/${userLists._id}`,
        {
          updatedLists: userLists.lists,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        // TODO: hallar forma de hacer esto sin tener que esperar a la response
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleCardCreator = (listId) => {
    setCardName("");
    setColumnCreateCard(listId);
  };

  const toggleCreatingList = () => {
    setListName("");
    setCreatingList((prevState) => !prevState);
  };

  const createCardHandler = () => {
    axios
      .post(
        `board/list/${userLists._id}`,
        {
          name: cardName,
          listChangedId: columnCreateCard,
          boardId: boardId,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const updatedUserLists = copyUserListsArray(userLists);
        updatedUserLists.lists.forEach((list) => {
          if (list._id.toString() === columnCreateCard.toString()) {
            list.cardIds.push(res.data.card);
          }
        });

        setUserLists(updatedUserLists);
        toggleCardCreator("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createNewListHandler = (event) => {
    event.preventDefault();

    axios
      .post(
        `board/${boardId}`,
        {
          name: listName,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const updatedUserLists = copyUserListsArray(userLists);
        updatedUserLists.lists.push(res.data.list);

        setUserLists(updatedUserLists);
        toggleCreatingList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editListNameHandler = (event, listId) => {
    event.preventDefault();
    const listChangedIndex = userLists.lists.findIndex(
      (list) => list._id.toString() === listId.toString()
    );
    const updatedListName = event.target.value;

    if (userLists.lists[listChangedIndex].name !== updatedListName) {
      const updatedUserLists = copyUserListsArray(userLists);
      updatedUserLists.lists[listChangedIndex].name = updatedListName;

      axios
        .patch(
          `board/list/${userLists._id}`,
          {
            updatedLists: updatedUserLists.lists,
          },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          setUserLists(updatedUserLists);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let lists = <p>Cargando</p>;
  if (userLists && userLists.lists.length > 0) {
    lists = userLists.lists.map((list) => (
      <List
        key={list._id}
        listData={list}
        columnCreateCard={columnCreateCard}
        cardName={cardName}
        cardNameChanged={(event) => setCardName(event.target.value)}
        setCardCreator={(id) => toggleCardCreator(id)}
        createCard={createCardHandler}
        editListName={(event) => editListNameHandler(event, list._id)}
      />
    ));
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className={classes.Container}>
        <div className={classes.Board}>
          {lists}
          <NewList
            creating={creatingList}
            toggleCreating={toggleCreatingList}
            newListName={listName}
            newListNameChanged={(event) => setListName(event.target.value)}
            createNewList={createNewListHandler}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
