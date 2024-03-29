import React from "react";
import {
  IoCheckmarkSharp,
  IoChevronBackOutline,
  IoCloseOutline,
} from "react-icons/io5";

import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";
import Spinner from "../../../../UI/Spinner/spinner";
import { appColors } from "../../../../../util/board";

import classes from "./tagCreator.module.scss";

const TagCreator = ({
  creating,
  closeModal,
  exitModals,
  cardName,
  cardColor,
  changeCardName,
  changeCardColor,
  tagAction,
  onDeleteTag,
  loading,
}) => {
  const colorElements = appColors.map((clr) => {
    const clrClass = `color-${clr}`;
    return (
      <span key={clr} className={clrClass} onClick={() => changeCardColor(clr)}>
        {cardColor === clr ? <IoCheckmarkSharp /> : ""}
      </span>
    );
  });

  let actionButtons = (
    <Button
      color="secondary"
      variant="contained"
      type="button"
      clicked={tagAction}
      btnDisabled={loading}
    >
      Crear
    </Button>
  );
  if (!creating) {
    actionButtons = (
      <>
        <Button
          color="secondary"
          variant="contained"
          type="button"
          clicked={tagAction}
          btnDisabled={loading}
        >
          Editar
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          type="button"
          clicked={onDeleteTag}
          btnDisabled={loading}
        >
          Eliminar
        </Button>
      </>
    );
  }

  return (
    <CardModal close={exitModals}>
      <div className={classes.TagHeader}>
        <IoChevronBackOutline onClick={closeModal} />
        <h2>{creating ? "Crear Etiqueta" : "Cambiar Etiqueta"}</h2>
        <IoCloseOutline onClick={exitModals} />
      </div>

      <div>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          value={cardName}
          onChange={changeCardName}
        />
      </div>

      <div className={classes.ColorsWrapper}>
        <p>Seleccionar un color:</p>
        <div className={classes.Colors}>{colorElements}</div>
      </div>

      <div className={classes.ActionButtons}>
        {loading ? <Spinner color="primary" /> : actionButtons}
      </div>
    </CardModal>
  );
};

export default TagCreator;
