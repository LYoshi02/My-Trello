import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import Backdrop from "../../UI/Backdrop/backdrop";

import classes from "./modal.module.scss";

const Modal = (props) => {
  return (
    <div className={classes.Modal}>
      <form className={classes.ModalForm} onSubmit={props.createBoard}>
        <div className={classes.ModalContent}>
          <div className={classes.ModalCard}>
            <input
              type="text"
              name="title"
              placeholder="Añadir título del tablero"
              value={props.boardName}
              onChange={props.boardNameChanged}
            />
            <IoCloseOutline onClick={props.closeModal} />
          </div>

          <div className={classes.ModalBackground}>
            <div></div>
            <div></div>
            <div></div>

            <div></div>
            <div></div>
            <div></div>

            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <button type="submit">Crear Tablero</button>
      </form>

      <Backdrop clicked={props.closeModal} />
    </div>
  );
};

export default Modal;
