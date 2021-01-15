import React from "react";

import classes from "./actions.module.scss";

const actionItems = {
  cardAddings: {
    title: "Añadir a la tarjeta",
    items: [
      {
        name: "Checklist",
        modalType: "checklist",
      },
      {
        name: "Etiquetas",
        modalType: "tag",
      },
      {
        name: "Adjunto",
        modalType: "attachment",
      },
    ],
  },
  cardActions: {
    title: "Acciones",
    items: [
      {
        name: "Borrar",
        modalType: "delete",
      },
    ],
  },
};

const Actions = ({ toggleModal }) => {
  const actionElements = [];
  for (let itemKey in actionItems) {
    const itemElements = actionItems[itemKey].items.map((item) => (
      <button key={item.name} onClick={() => toggleModal(item.modalType)}>
        {item.name}
      </button>
    ));

    const element = (
      <div key={itemKey}>
        <h3>{actionItems[itemKey].title}</h3>
        {itemElements}
      </div>
    );

    actionElements.push(element);
  }

  return <div className={classes.Actions}>{actionElements}</div>;
};

export default Actions;
