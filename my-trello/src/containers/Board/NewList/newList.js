import React, { useState, useRef } from "react";
import { IoAddOutline } from "react-icons/io5";

import axios from "../../../axios-instance";
import ActionButtons from "../../../components/UI/ActionButtons/actionButtons";
import Button from "../../../components/UI/Button/button";
import Spinner from "../../../components/UI/Spinner/spinner";
import { useAuth } from "../../../contexts/AuthContext";

import classes from "./newList.module.scss";

const NewList = ({ boardId, onAddNewList }) => {
  const [listName, setListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [reqNewListLoading, setReqNewListLoading] = useState(false);
  const { token } = useAuth();
  const nameInputRef = useRef();

  const toggleCreatingList = () => {
    setListName("");
    setCreatingList((prevState) => !prevState);
  };

  const createNewListHandler = (event) => {
    event.preventDefault();

    if (listName.trim().length === 0) {
      return nameInputRef.current.focus();
    }

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
        onAddNewList(res.data.list);
        toggleCreatingList();
      })
      .catch((err) => {
        setReqNewListLoading(false);
        console.log(err);
      });
  };

  const listNameChanged = (e) => {
    setListName(e.target.value);
  };

  let newListContent = (
    <div className={classes.NewList}>
      <Button
        type="button"
        color="secondary"
        variant="outlined"
        clicked={toggleCreatingList}
      >
        <IoAddOutline /> Añada otra lista
      </Button>
    </div>
  );
  if (creatingList) {
    newListContent = (
      <form className={classes.NewListForm} onSubmit={createNewListHandler}>
        <div>
          <input
            type="text"
            placeholder="Introduzca el título de la lista..."
            value={listName}
            onChange={listNameChanged}
            autoFocus
            ref={nameInputRef}
          />
        </div>
        <ActionButtons
          btnType="submit"
          btnColor="secondary"
          btnContent={reqNewListLoading ? <Spinner /> : "Añadir lista"}
          disabled={reqNewListLoading}
          cancelAction={toggleCreatingList}
        />
      </form>
    );
  }

  return <div className={classes.Container}>{newListContent}</div>;
};

export default NewList;
