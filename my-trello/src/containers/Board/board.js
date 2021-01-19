import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";
import { DragDropContext } from "react-beautiful-dnd";

import List from "../../components/Board/List/list";
import NewList from "../../components/Board/NewList/newList";
import { updateObject } from "../../util/helpers";
import { isMovementEqual } from "../../util/board";

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
      const startIndex = userLists.findIndex(
        (list) => list._id.toString() === result.source.droppableId
      );
      const finishIndex = userLists.findIndex(
        (list) => list._id.toString() === result.destination.droppableId
      );
      const draggedItem = userLists[startIndex].cardIds.find(
        (card) => card._id.toString() === result.draggableId
      );
      const changedLists = [];
      const updatedUserLists = [...userLists];

      if (startIndex === finishIndex) {
        const newCardIds = [...userLists[startIndex].cardIds];
        newCardIds.splice(result.source.index, 1);
        newCardIds.splice(result.destination.index, 0, draggedItem);
        const newColumn = updateObject(userLists[startIndex], {
          cardIds: newCardIds,
        });

        changedLists.push(newColumn);
        updatedUserLists.splice(startIndex, 1, newColumn);
      } else {
        const startCardIds = [...userLists[startIndex].cardIds];
        startCardIds.splice(result.source.index, 1);
        const newStartColumn = updateObject(userLists[startIndex], {
          cardIds: startCardIds,
        });

        const finishCardIds = [...userLists[finishIndex].cardIds];
        finishCardIds.splice(result.destination.index, 0, draggedItem);
        const newFinishColumn = updateObject(userLists[finishIndex], {
          cardIds: finishCardIds,
        });

        changedLists.push(newStartColumn, newFinishColumn);
        updatedUserLists.splice(startIndex, 1, newStartColumn);
        updatedUserLists.splice(finishIndex, 1, newFinishColumn);
      }

      setUserLists(updatedUserLists);
      updateUserLists(changedLists);
    }
  };

  const updateUserLists = (updatedLists) => {
    axios
      .patch(
        `board/${boardId}/list`,
        { updatedLists },
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

  const createCardHandler = (listId) => {
    axios
      .post(
        `board/${boardId}/list/${listId}`,
        { name: cardName },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const updatedListIndex = userLists.findIndex(
          (list) => list._id.toString() === listId
        );
        const updatedCards = [
          ...userLists[updatedListIndex].cardIds,
          res.data.card,
        ];
        const updatedList = updateObject(userLists[updatedListIndex], {
          cardIds: updatedCards,
        });
        const updatedLists = [...userLists];
        updatedLists.splice(updatedListIndex, 1, updatedList);

        setUserLists(updatedLists);
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
        setUserLists((prevState) => [...prevState, res.data.list]);
        toggleCreatingList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editListNameHandler = (event, listId) => {
    event.preventDefault();
    const newListName = event.target.value.trim();

    const changedList = userLists.find(
      (list) => list._id.toString() === listId
    );
    if (newListName !== "" && newListName !== changedList.name) {
      axios
        .patch(
          `board/${boardId}/list/${listId}`,
          { name: newListName },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          console.log(res);
          const updatedListIndex = userLists.findIndex(
            (list) => list._id.toString() === listId
          );
          const updatedList = updateObject(userLists[updatedListIndex], {
            name: res.data.list.name,
          });
          const updatedLists = [...userLists];
          updatedLists.splice(updatedListIndex, 1, updatedList);
          setUserLists(updatedLists);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let lists = <p>Cargando</p>;
  if (userLists && userLists.length > 0) {
    lists = userLists.map((list) => (
      <List
        key={list._id}
        listData={list}
        columnCreateCard={columnCreateCard}
        cardName={cardName}
        cardNameChanged={(event) => setCardName(event.target.value)}
        setCardCreator={(id) => toggleCardCreator(id)}
        createCard={() => createCardHandler(list._id)}
        editListName={(e) => editListNameHandler(e, list._id)}
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
