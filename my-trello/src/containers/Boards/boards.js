import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";

import axios from "../../axios-instance";
import Modal from "../../components/Boards/Modal/modal";
import Spinner from "../../components/UI/Spinner/spinner";

import classes from "./boards.module.scss";

const Boards = ({ token }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardColor, setBoardColor] = useState("green");
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [userBoards, setUserBoards] = useState(null);
  const [reqLoading, setReqLoading] = useState(false);

  useEffect(() => {
    axios
      .get("boards", { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        setLoadingBoards(false);
        setUserBoards(res.data.boards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const toggleModal = () => {
    setBoardName("");
    setIsCreating((prevState) => !prevState);
  };

  const createBoardHandler = (event) => {
    event.preventDefault();
    if (boardName.trim() === "" || boardColor.trim() === "") return;
    const boardData = {
      name: boardName,
      background: {
        type: "color",
        content: boardColor,
      },
    };
    setReqLoading(true);

    axios
      .post("board", boardData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const boards = [...userBoards];
        const { _id, name, background } = res.data.board;
        boards.push({ _id, name, background });

        setReqLoading(false);
        setUserBoards(boards);
        toggleModal();
      })
      .catch((err) => {
        setReqLoading(false);
        console.log(err);
      });
  };

  let boardElement = null;
  if (loadingBoards) {
    boardElement = <Spinner color="primary" />;
  } else if (userBoards) {
    boardElement = (
      <div>
        <div className={classes.BoardTitle}>
          <h2>
            <IoPersonOutline /> Tus Tableros
          </h2>
        </div>
        <ul className={classes.Boards}>
          {userBoards.map((board) => (
            <li
              key={board._id}
              className={`${classes.BoardItem} color-${board.background.content}`}
            >
              <Link to={`/board/${board._id}`}>{board.name}</Link>
            </li>
          ))}
          <li className={classes.CreateBoard} onClick={toggleModal}>
            <p>Crear Tablero</p>
          </li>
        </ul>
      </div>
    );
  }

  let modal = null;
  if (isCreating) {
    modal = (
      <Modal
        closeModal={toggleModal}
        createBoard={createBoardHandler}
        boardName={boardName}
        boardColor={boardColor}
        boardNameChanged={(event) => setBoardName(event.target.value)}
        boardColorChanged={(color) => setBoardColor(color)}
        loading={reqLoading}
      />
    );
  }

  return (
    <>
      <div className={classes.BoardsContainer}>{boardElement}</div>

      {modal}
    </>
  );
};

export default Boards;
