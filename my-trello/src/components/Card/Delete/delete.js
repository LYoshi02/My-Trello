import React from "react";
import Button from "../../UI/Button/button";
import CardModal from "../Modal/modal";

const Delete = ({ isModalOpen, onCloseModal, onDeleteCard }) => {
  let modal = null;

  if (isModalOpen) {
    modal = (
      <CardModal close={onCloseModal}>
        <h2>Eliminar tarjeta</h2>
        <p>¿Estas seguro que quieres eliminar esta tarjeta?</p>
        <Button type="button" clicked={onDeleteCard}>
          Eliminar
        </Button>
      </CardModal>
    );
  }

  return modal;
};

export default Delete;
