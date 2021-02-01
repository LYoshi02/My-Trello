import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { IoAddSharp, IoTrashOutline } from "react-icons/io5";
import { Draggable, Droppable } from "react-beautiful-dnd";

import axios from "../../../axios-instance";
import Button from "../../../components/UI/Button/button";
import CardForm from "../../../components/Board/CardForm/cardForm";
import CardPreview from "../../../components/Board/CardPreview/cardPreview";
import DeleteModal from "../../../components/Board/DeleteModal/deleteModal";
import Spinner from "../../../components/UI/Spinner/spinner";
import TransparentInput from "../../../components/UI/TransparentInput/transparentInput";
import { updateObject } from "../../../util/helpers";
import { useAuth } from "../../../contexts/AuthContext";

import classes from "./list.module.scss";

const List = ({ listData, boardId, onUpdateListData, onDeleteList }) => {
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [reqCardLoading, setReqCardLoading] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);
  const [reqDeleteLoading, setReqDeleteLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [listInput, setListInput] = useState({
    elementType: "input",
    elementConfig: {
      type: "text",
    },
    value: "",
  });
  const { token } = useAuth();
  const history = useHistory();

  const changeListName = useCallback(
    (value) => {
      setListInput((prevState) => {
        return updateObject(prevState, { value });
      });
    },
    [setListInput]
  );

  useEffect(() => {
    changeListName(listData.name);
  }, [listData.name, changeListName]);

  const openCard = (cardId) => {
    history.push(`/card/${cardId}`);
  };

  const toggleCardCreator = () => {
    setCardName("");
    setIsCreatingCard((prevState) => !prevState);
  };

  const toggleDeleteModal = () => {
    setIsDeletingList((prevState) => !prevState);
  };

  const cardNameChanged = (event) => {
    setCardName(event.target.value);
  };

  const listNameChanged = (event) => {
    changeListName(event.target.value);
  };

  const editNameHandler = () => {
    if (listInput.value !== "" && listInput.value !== listData.name) {
      editListName();
    } else {
      changeListName(listData.name);
    }
  };

  const editListName = () => {
    axios
      .patch(
        `board/${boardId}/list/${listData._id}`,
        { name: listInput.value },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const updatedList = updateObject(listData, { name: listInput.value });
        onUpdateListData(listData._id, updatedList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createCardHandler = () => {
    if (cardName.trim().length === 0) return;

    setReqCardLoading(true);
    axios
      .post(
        `board/${boardId}/list/${listData._id}`,
        { name: cardName },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const updatedList = updateObject(listData, {
          cardIds: [...listData.cardIds, res.data.card],
        });

        onUpdateListData(listData._id, updatedList);
        setReqCardLoading(false);
        setCardName("");
      })
      .catch((err) => {
        setReqCardLoading(false);
        toggleCardCreator();
      });
  };

  const deleteListHandler = () => {
    setReqDeleteLoading(true);
    axios
      .delete(`board/${boardId}/list/${listData._id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        setReqDeleteLoading(false);
        toggleDeleteModal();
        onDeleteList(listData._id);
      })
      .catch(() => {
        setReqDeleteLoading(false);
        toggleDeleteModal();
      });
  };

  let listCards = null;
  if (listData.cardIds.length > 0) {
    listCards = listData.cardIds.map((card, index) => (
      <Draggable key={card._id} draggableId={card._id} index={index}>
        {(provided, snapshot) => (
          <CardPreview
            provided={provided}
            onOpenCard={() => openCard(card._id)}
            cardData={card}
            isDragging={snapshot.isDragging}
          />
        )}
      </Draggable>
    ));
  }

  let cardAction = (
    <Button
      type="button"
      color="primary"
      variant="outlined"
      clicked={toggleCardCreator}
    >
      <IoAddSharp />
      Añada otra tarjeta
    </Button>
  );
  if (isCreatingCard && reqCardLoading) {
    cardAction = <Spinner color="primary" />;
  } else if (isCreatingCard) {
    cardAction = (
      <CardForm
        onCreateCard={createCardHandler}
        cardName={cardName}
        onCardNameChanged={cardNameChanged}
        onToggleCreator={toggleCardCreator}
      />
    );
  }

  let deleteModal = null;
  if (isDeletingList) {
    deleteModal = (
      <DeleteModal
        onClose={toggleDeleteModal}
        title="¿Desea eliminar la lista?"
        btnText="Eliminar"
        reqLoading={reqDeleteLoading}
        onDelete={deleteListHandler}
      />
    );
  }

  return (
    <>
      {deleteModal}
      <div className={classes.List}>
        <div className={classes.ListContent}>
          <div className={classes.ListHeader}>
            <TransparentInput
              inputChanged={listNameChanged}
              inputData={listInput}
              blurred={editNameHandler}
            />
            <IoTrashOutline onClick={toggleDeleteModal} />
          </div>

          <Droppable droppableId={listData._id}>
            {(provided) => (
              <div
                className={classes.Cards}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div>
                  {listCards}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          <div className={classes.ListAction}>{cardAction}</div>
        </div>
      </div>
    </>
  );
};

export default List;
