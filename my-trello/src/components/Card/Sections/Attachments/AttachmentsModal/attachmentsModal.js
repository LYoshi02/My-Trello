import React from "react";

import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

import classes from "./attachmentsModal.module.scss";

const AttachmentsModal = ({
  inputData,
  isEditing,
  onClose,
  onSubmitForm,
  onFileUpload,
  onInputChanged,
}) => {
  let modalForm = null;
  if (!isEditing) {
    modalForm = (
      <>
        <div className={classes.FileUpload}>
          <label htmlFor="file">Subir archivo</label>
          <input
            type="file"
            id="file"
            name="attachedFile"
            onChange={onFileUpload}
          />
        </div>

        <div className={classes.FormGroup}>
          <label htmlFor="link">Adjuntar un enlace:</label>
          <input
            type="url"
            id="link"
            value={inputData.url}
            onChange={(e) => onInputChanged(e.target.value, "url")}
          />
        </div>
      </>
    );
  }

  return (
    <CardModal close={onClose}>
      <h2>{isEditing ? "Editar Adjunto" : "Adjuntar a partir de..."}</h2>

      <form onSubmit={onSubmitForm}>
        {modalForm}
        <div className={classes.FormGroup}>
          <label htmlFor="link-name">Nombre del enlace:</label>
          <input
            type="text"
            id="link-name"
            value={inputData.name}
            onChange={(e) => onInputChanged(e.target.value, "name")}
          />
        </div>
        <Button color="secondary" variant="contained" type="submit">
          {isEditing ? "Editar" : "Adjuntar"}
        </Button>
      </form>
    </CardModal>
  );
};

export default AttachmentsModal;
