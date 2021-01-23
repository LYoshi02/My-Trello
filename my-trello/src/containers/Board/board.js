import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";
import { DragDropContext } from "react-beautiful-dnd";

import Alert from "../../components/UI/Alert/alert";
import List from "../../components/Board/List/list";
import NewList from "../../components/Board/NewList/newList";
import Spinner from "../../components/UI/Spinner/spinner";
import { updateObject } from "../../util/helpers";
import { isMovementEqual } from "../../util/board";

import classes from "./board.module.scss";

const Board = (props) => {
  const [userLists, setUserLists] = useState(null);
  const [cardName, setCardName] = useState("");
  const [columnCreateCard, setColumnCreateCard] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [listName, setListName] = useState("");
  const [reqCardLoading, setReqCardLoading] = useState(false);
  const [reqNewListLoading, setReqNewListLoading] = useState(false);
  const [reqError, setReqError] = useState(null);

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
        const message = err.response ? err.response.data.message : err.message;
        setReqError(message);
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

  const createCardHandler = (event, listId) => {
    event.preventDefault();
    if (cardName.trim() === "") return;

    setReqCardLoading(true);
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

        setReqCardLoading(false);
        toggleCardCreator("");
        setUserLists(updatedLists);
      })
      .catch((err) => {
        setReqCardLoading(false);
        toggleCardCreator("");
      });
  };

  const createNewListHandler = (event) => {
    event.preventDefault();

    if (listName.trim() === "") return;

    setReqNewListLoading(true);
    axios
      .post(
        `board/${boardId}`,
        {
          name: listName,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        setReqNewListLoading(false);
        setUserLists((prevState) => [...prevState, res.data.list]);
        toggleCreatingList();
      })
      .catch((err) => {
        setReqNewListLoading(false);
        console.log(err);
      });
  };

  const editListNameHandler = (newListName, listId) => {
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
  };

  const deleteListHandler = (listId) => {
    console.log(listId);
  };

  let boardElement = <Spinner color="primary" />;
  if (userLists && userLists.length > 0) {
    boardElement = (
      <div className={classes.Board}>
        {userLists.map((list) => (
          <List
            key={list._id}
            listData={list}
            isCreatingCard={columnCreateCard === list._id}
            cardName={cardName}
            cardNameChanged={(event) => setCardName(event.target.value)}
            setCardCreator={(id) => toggleCardCreator(id)}
            createCard={(event) => createCardHandler(event, list._id)}
            editListName={(e) => editListNameHandler(e, list._id)}
            reqCardLoading={reqCardLoading}
            onDeleteList={() => deleteListHandler(list._id)}
          />
        ))}
        <NewList
          creating={creatingList}
          toggleCreating={toggleCreatingList}
          newListName={listName}
          newListNameChanged={(event) => setListName(event.target.value)}
          createNewList={createNewListHandler}
          reqListLoading={reqNewListLoading}
        />
      </div>
    );
  } else if (reqError) {
    boardElement = <Alert>{reqError}</Alert>;
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className={classes.Container}>{boardElement}</div>
    </DragDropContext>
  );
};

export default Board;
