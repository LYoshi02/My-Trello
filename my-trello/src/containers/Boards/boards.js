import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";

import axios from "../../axios-instance";
import Modal from "../../components/Boards/Modal/modal";

import classes from "./boards.module.scss";

const Boards = ({ token }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [userBoards, setUserBoards] = useState(null);

  useEffect(() => {
    axios
      .get("boards", { headers: { Authorization: "Bearer " + token } })
      .then((res) => {
        console.log(res);
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
    axios
      .post(
        "board",
        {
          name: boardName,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        const boards = [...userBoards];
        const { _id, name } = res.data.board;
        boards.push({ _id, name });

        setUserBoards(boards);
        toggleModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let boards = null;
  if (loadingBoards) {
    boards = <span>Loading your boards...</span>;
  } else if (userBoards && userBoards.length > 0) {
    boards = userBoards.map((board) => (
      <li key={board._id} className={classes.BoardItem}>
        <Link to={`/board/${board._id}`}>{board.name}</Link>
      </li>
    ));
  } else {
    boards = <span>Not boards found</span>;
  }

  return (
    <>
      <div className={classes.BoardsContainer}>
        {/* Board Sections */}
        <div>
          <div>
            <div className={classes.BoardTitle}>
              <p>
                <IoPersonOutline /> Tableros Personales
              </p>
            </div>
            <ul className={classes.Boards}>
              {boards}
              <li className={classes.CreateBoard} onClick={toggleModal}>
                <p>Create Board</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isCreating ? (
        <Modal
          closeModal={toggleModal}
          createBoard={createBoardHandler}
          boardName={boardName}
          boardNameChanged={(event) => setBoardName(event.target.value)}
        />
      ) : null}
    </>
  );
};

export default Boards;
