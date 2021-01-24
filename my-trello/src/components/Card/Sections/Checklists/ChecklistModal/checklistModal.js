import React from "react";

import Button from "../../../../UI/Button/button";
import CardModal from "../../../Modal/modal";

const ChecklistModal = ({ close, submit, title, changed }) => {
  return (
    <CardModal close={close}>
      <h2>Añadir Checklist</h2>

      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            placeholder="Ingrese el título del checklist"
            autoFocus
            id="title"
            value={title}
            onChange={changed}
            required
          />
        </div>

        <Button color="secondary" variant="contained" type="submit">
          Añadir
        </Button>
      </form>
    </CardModal>
  );
};

export default ChecklistModal;
