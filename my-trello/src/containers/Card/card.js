import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "../../axios-instance";

import Actions from "../../components/Card/Actions/actions";
import Attachment from "./Attachment/attachment";
import Checklist from "./Checklist/checklist";
import Delete from "../../components/Card/Delete/delete";
import Description from "./Description/description";
import Name from "./Name/name";
import Tag from "./Tag/tag";
import { updateObject } from "../../util/helpers";

import classes from "./card.module.scss";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [activeModal, setActiveModal] = useState("");
  let history = useHistory();

  const cardId = props.match.params.cardId;
  const token = props.token;
  useEffect(() => {
    axios
      .get(`card/${cardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cardId, token]);

  const saveInput = (inputName, inputValue) => {
    if (!cardData[inputName] || cardData[inputName] !== inputValue) {
      const updatedCard = updateObject(cardData, {
        [inputName]: inputValue,
      });
      // TODO: hallar forma de hacer esto sin tener que esperar a la response para añadir multiples etiquetas
      // setCardData(updatedCard);

      axios
        .put(
          `/card/${cardData._id}`,
          {
            card: updatedCard,
          },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          console.log(res);
          setCardData(res.data.card);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteCardHandler = () => {
    axios
      .delete(`card/${cardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        history.replace(`/board/${res.data.card.boardId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateSelectedTagsHandler = (editedTag) => {
    const updatedSelectedTags = cardData.selectedTags.map((st) => {
      if (st._id.toString() === editedTag._id.toString()) {
        return editedTag;
      }

      return st;
    });
    const updatedCardData = updateObject(cardData, {
      selectedTags: updatedSelectedTags,
    });
    setCardData(updatedCardData);
  };

  const deleteSelectedTagsHandler = (tagId) => {
    const updatedTags = cardData.selectedTags.filter(
      (st) => st._id.toString() !== tagId
    );
    const updatedCard = updateObject(cardData, {
      selectedTags: updatedTags,
    });
    setCardData(updatedCard);
  };

  const createAttachmentHandler = (attachmentData, type) => {
    let url = `card/${cardId}/attach-link`;
    if (type === "file") {
      url = `card/${cardId}/attach-file`;
    }

    axios
      .post(url, attachmentData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteAttachmentHandler = (attachmentId) => {
    console.log(attachmentId);
    axios
      .delete(`card/${cardId}/attachment/${attachmentId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeActiveModal = (activeModal) => {
    setActiveModal(activeModal);
  };

  const closeModalHandler = () => {
    setActiveModal(null);
  };

  let mainCardContent = null,
    nameCard = null;
  if (cardData) {
    nameCard = <Name name={cardData.name} inputSaveName={saveInput} />;

    mainCardContent = (
      <div className={classes.MainContent}>
        <Tag
          boardId={cardData.boardId}
          selectedTags={cardData.selectedTags}
          isModalOpen={activeModal === "tag"}
          openModal={changeActiveModal}
          closeModal={closeModalHandler}
          onSaveSelectedTag={saveInput}
          onDeleteSelectedTags={deleteSelectedTagsHandler}
          onUpdateSelectedTags={updateSelectedTagsHandler}
          token={token}
        />
        <Description
          description={cardData.description}
          inputSaveDescription={saveInput}
        />
        <Attachment
          isModalOpen={activeModal === "attachment"}
          fetchedAttachments={cardData.attachments}
          onCloseModal={closeModalHandler}
          onCreateAttachment={createAttachmentHandler}
          onDeleteAttachment={deleteAttachmentHandler}
          onEditAttachment={saveInput}
        />
        <Checklist
          closeModal={closeModalHandler}
          isModalOpen={activeModal === "checklist"}
          fetchedChecklists={cardData.checklists}
          updateChecklists={saveInput}
        />
        <Delete
          isModalOpen={activeModal === "delete"}
          onCloseModal={closeModalHandler}
          onDeleteCard={deleteCardHandler}
        />
      </div>
    );
  }

  return (
    <div className={classes.Card}>
      <div className={classes.CardHeader}>{nameCard}</div>

      <div className={classes.CardBody}>
        {mainCardContent}

        <Actions toggleModal={changeActiveModal} />
      </div>
    </div>
  );
};

export default Card;
