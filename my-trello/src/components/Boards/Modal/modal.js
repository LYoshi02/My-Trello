import React from "react";
import { IoCloseOutline, IoCheckmarkSharp } from "react-icons/io5";

import Backdrop from "../../UI/Backdrop/backdrop";
import Button from "../../UI/Button/button";
import Spinner from "../../UI/Spinner/spinner";
import { appColors } from "../../../util/board";

import classes from "./modal.module.scss";

const Modal = ({
  closeModal,
  createBoard,
  boardName,
  boardColor,
  boardNameChanged,
  boardColorChanged,
  loading,
}) => {
  return (
    <div className={classes.Modal}>
      <form className={classes.ModalForm} onSubmit={createBoard}>
        <div className={classes.ModalContent}>
          <div className={`${classes.ModalCard} color-${boardColor}`}>
            <input
              type="text"
              name="title"
              placeholder="Añadir título del tablero"
              value={boardName}
              onChange={boardNameChanged}
              required
            />
            <IoCloseOutline onClick={closeModal} />
          </div>

          <div className={classes.ModalBackground}>
            {appColors.map((color) => {
              return (
                <div
                  className={`color-${color}`}
                  key={color}
                  onClick={() => boardColorChanged(color)}
                >
                  {boardColor === color ? <IoCheckmarkSharp /> : null}
                </div>
              );
            })}
          </div>
        </div>
        <Button
          btnDisabled={loading}
          type="submit"
          variant="contained"
          color="primary"
        >
          {loading ? <Spinner /> : "Crear Tablero"}
        </Button>
      </form>

      <Backdrop clicked={closeModal} />
    </div>
  );
};

export default Modal;
