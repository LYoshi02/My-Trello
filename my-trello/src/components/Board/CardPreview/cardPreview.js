import React from "react";
import {
  IoMenuOutline,
  IoCheckboxOutline,
  IoAttachOutline,
} from "react-icons/io5";

import classes from "./cardPreview.module.scss";

const CardPreview = ({ provided, onOpenCard, cardData, isDragging }) => {
  let cardTags = null;
  if (cardData.selectedTags.length > 0) {
    cardTags = (
      <div className={classes.Tags}>
        {cardData.selectedTags.map((st) => {
          const clrClass = `color-${st.color}`;
          return (
            <span
              key={st._id}
              className={`${clrClass} ${classes.TagElement}`}
            ></span>
          );
        })}
      </div>
    );
  }

  let description = null;
  if (cardData.description && cardData.description.length > 0) {
    description = <IoMenuOutline />;
  }

  let checklist = null;
  if (cardData.checklists && cardData.checklists.length > 0) {
    let totalItems = 0,
      completedItems = 0;
    cardData.checklists.forEach((checklist) => {
      totalItems += checklist.items.length;
      completedItems += checklist.items.filter((i) => i.completed).length;
    });

    if (totalItems > 0) {
      const checklistClasses = [classes.Checklists];
      if (totalItems === completedItems) {
        checklistClasses.push(classes.ChecklistsCompleted);
      }

      checklist = (
        <span className={checklistClasses.join(" ")}>
          <IoCheckboxOutline /> {`${completedItems} / ${totalItems}`}
        </span>
      );
    }
  }

  let imgAttachment = null;
  let attachments = null;
  if (cardData.attachments && cardData.attachments.length > 0) {
    const totalItems = cardData.attachments.length;
    const image = cardData.attachments.find(
      (att) => att.type === "jpg" || att.type === "jpeg" || att.type === "png"
    );

    if (image) {
      imgAttachment = (
        <img
          className={classes.Image}
          src={process.env.REACT_APP_BACKEND_URL + image.url}
          alt={image.name}
        />
      );
    }

    attachments = (
      <span>
        <IoAttachOutline /> {totalItems}
      </span>
    );
  }

  let cardFooter = null;
  if (description || checklist || attachments) {
    cardFooter = (
      <div className={classes.CardFooter}>
        {description}
        {attachments}
        {checklist}
      </div>
    );
  }

  let cardClasses = [classes.Card];
  if (isDragging) {
    cardClasses.push(classes.CardDragged);
  }

  return (
    <div
      className={classes.CardContainer}
      onClick={onOpenCard}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      {imgAttachment}
      <div className={cardClasses.join(" ")}>
        {cardTags}
        <p>{cardData.name}</p>
        {cardFooter}
      </div>
    </div>
  );
};

export default CardPreview;
