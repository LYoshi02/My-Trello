import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { IoTrashOutline } from "react-icons/io5";

import axios from "../../axios-instance";
import Alert from "../../components/UI/Alert/alert";
import Button from "../../components/UI/Button/button";
import List from "./List/list";
import NewList from "./NewList/newList";
import Spinner from "../../components/UI/Spinner/spinner";
import { updateObject } from "../../util/helpers";
import { isMovementEqual } from "../../util/board";

import classes from "./board.module.scss";
import DeleteModal from "../../components/Board/DeleteModal/deleteModal";

const Board = (props) => {
  const [userLists, setUserLists] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [reqError, setReqError] = useState(null);
  const [isDeletingBoard, setIsDeleteingBoard] = useState(false);
  const [reqDeleteLoading, setReqDeleteLoading] = useState(false);
  const history = useHistory();

  const { boardId } = props.match.params;
  const { token } = props;

  useEffect(() => {
    axios
      .get(`board/${boardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setBoardData(res.data.boardData.board);
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
      updatedCardPositions(changedLists);
    }
  };

  const updatedCardPositions = (updatedLists) => {
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

  const toggleDeleteModal = () => {
    setIsDeleteingBoard((prevState) => !prevState);
  };

  const deleteBoardHandler = () => {
    setReqDeleteLoading(true);
    axios
      .delete(`/board/${boardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        setReqDeleteLoading(false);
        history.push("/boards");
      })
      .catch((err) => {
        setReqDeleteLoading(false);
        console.log(err);
      });
  };

  const updateListsDataHandler = (listId, updatedList) => {
    setUserLists((prevState) =>
      prevState.map((list) => (list._id !== listId ? list : updatedList))
    );
  };

  const addListHandler = (list) => {
    setUserLists((prevState) => [...prevState, list]);
  };

  const deleteListHandler = (listId) => {
    setUserLists((prevState) =>
      prevState.filter((list) => list._id !== listId)
    );
  };

  let boardElement = <Spinner color="primary" />;
  if (boardData && userLists && userLists.length > 0) {
    boardElement = (
      <>
        <div className={classes.BoardName}>
          <h1>{boardData.name}</h1>

          <Button
            type="button"
            variant="contained"
            color="secondary"
            clicked={toggleDeleteModal}
          >
            <IoTrashOutline />
            Eliminar Tablero
          </Button>
        </div>
        <DragDropContext onDragEnd={dragEndHandler}>
          <div className={classes.Board}>
            {userLists.map((list) => (
              <List
                key={list._id}
                listData={list}
                boardId={boardId}
                token={token}
                onUpdateListData={updateListsDataHandler}
                onDeleteList={deleteListHandler}
              />
            ))}
            <NewList
              boardId={boardId}
              token={token}
              onAddNewList={addListHandler}
            />
          </div>
        </DragDropContext>
      </>
    );
  } else if (reqError) {
    boardElement = <Alert>{reqError}</Alert>;
  }

  let deleteModal = null;
  if (isDeletingBoard) {
    deleteModal = (
      <DeleteModal
        onClose={toggleDeleteModal}
        title="¿Desea eliminar el tablero?"
        btnText="Eliminar"
        reqLoading={reqDeleteLoading}
        onDelete={deleteBoardHandler}
      />
    );
  }

  return (
    <>
      {deleteModal}
      <div className={classes.Container}>{boardElement}</div>
    </>
  );
};

export default Board;
