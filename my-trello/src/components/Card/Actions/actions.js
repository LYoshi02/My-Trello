import React from "react";

import {
  IoCheckboxOutline,
  IoPricetagOutline,
  IoAttachOutline,
  IoTrashOutline,
} from "react-icons/io5";

import classes from "./actions.module.scss";

const actionItems = {
  cardAddings: {
    title: "Añadir a la tarjeta",
    items: [
      {
        name: "Checklist",
        modalType: "checklist",
        icon: <IoCheckboxOutline />,
      },
      {
        name: "Etiquetas",
        modalType: "tag",
        icon: <IoPricetagOutline />,
      },
      {
        name: "Adjunto",
        modalType: "attachment",
        icon: <IoAttachOutline />,
      },
    ],
  },
  cardActions: {
    title: "Acciones",
    items: [
      {
        name: "Borrar",
        modalType: "delete",
        icon: <IoTrashOutline />,
      },
    ],
  },
};

const Actions = ({ toggleModal }) => {
  const actionElements = [];
  for (let itemKey in actionItems) {
    const itemElements = actionItems[itemKey].items.map((item) => (
      <button key={item.name} onClick={() => toggleModal(item.modalType)}>
        {item.icon}
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
