import React from "react";

import Modal from "../../Card/Modal/modal";
import Button from "../../UI/Button/button";
import Spinner from "../../UI/Spinner/spinner";

const DeleteModal = ({ title, onClose, btnText, reqLoading, onDelete }) => {
  return (
    <Modal close={onClose}>
      <h2>{title}</h2>
      <p>No es posible deshacer la operación</p>
      <Button
        type="button"
        variant="contained"
        btnDisabled={reqLoading}
        color="secondary"
        clicked={onDelete}
      >
        {reqLoading ? <Spinner /> : btnText}
      </Button>
    </Modal>
  );
};

export default DeleteModal;
