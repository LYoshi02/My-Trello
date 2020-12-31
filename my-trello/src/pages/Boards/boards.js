import React, { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";

import Modal from "../../components/Boards/Modal/modal";

import classes from "./boards.module.scss";

const Boards = (props) => {
  const [isCreating, setIsCreating] = useState(false);
  const [boardName, setBoardName] = useState("");

  const toggleModal = () => {
    setBoardName("");
    setIsCreating((prevState) => !prevState);
  };

  const createBoardHandler = (event) => {
    event.preventDefault();
    console.log("Board name: ", boardName);
  };

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
              <li>
                <a href="/">Hello</a>
              </li>

              <li>
                <a href="/">Hello</a>
              </li>

              <li>
                <a href="/">Hello</a>
              </li>

              <li className={classes.CreateBoard} onClick={toggleModal}>
                <p>Create Board</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isCreating ? (
        <Modal
          clicked={toggleModal}
          createBoard={createBoardHandler}
          boardName={boardName}
          boardNameChanged={(event) => setBoardName(event.target.value)}
        />
      ) : null}
    </>
  );
};

export default Boards;
