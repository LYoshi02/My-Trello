import React from "react";

import Button from "../../UI/Button/button";
import CardModal from "../Modal/modal";
import Spinner from "../../UI/Spinner/spinner";

const Delete = ({ isModalOpen, onCloseModal, onDeleteCard, loading }) => {
  let modal = null;

  if (isModalOpen) {
    modal = (
      <CardModal close={onCloseModal}>
        <h2>Eliminar tarjeta</h2>
        <p>¿Estás seguro de que quieres eliminar esta tarjeta?</p>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          clicked={onDeleteCard}
          btnDisabled={loading}
        >
          {loading ? <Spinner /> : "Eliminar"}
        </Button>
      </CardModal>
    );
  }

  return modal;
};

export default Delete;
