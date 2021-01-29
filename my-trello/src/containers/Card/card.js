import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

import Actions from "../../components/Card/Actions/actions";
import Alert from "../../components/UI/Alert/alert";
import Attachment from "./Attachment/attachment";
import axios from "../../axios-instance";
import Button from "../../components/UI/Button/button";
import Checklist from "./Checklist/checklist";
import Delete from "../../components/Card/Delete/delete";
import Description from "./Description/description";
import Name from "./Name/name";
import Spinner from "../../components/UI/Spinner/spinner";
import Tag from "./Tag/tag";
import { updateObject } from "../../util/helpers";

import classes from "./card.module.scss";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [activeModal, setActiveModal] = useState("");
  const [reqError, setReqError] = useState(null);
  const [reqActionError, setReqActionError] = useState(null);
  const [reqDeleteLoading, setReqDeleteLoading] = useState(false);
  let history = useHistory();

  const cardId = props.match.params.cardId;
  const token = props.token;
  useEffect(() => {
    axios
      .get(`card/${cardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCardData(res.data.card);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err.message;
        setReqError(message);
      });
  }, [cardId, token]);

  const saveInput = (inputName, inputValue) => {
    if (!cardData[inputName] || cardData[inputName] !== inputValue) {
      const updatedCard = updateObject(cardData, {
        [inputName]: inputValue,
      });

      axios
        .put(
          `/card/${cardData._id}`,
          {
            card: updatedCard,
          },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          if (inputName !== "selectedTags") {
            setCardData(res.data.card);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteCardHandler = () => {
    setReqDeleteLoading(true);
    axios
      .delete(`card/${cardId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setReqDeleteLoading(false);
        history.replace(`/board/${res.data.card.boardId}`);
      })
      .catch((err) => {
        setReqDeleteLoading(false);
        console.log(err);
      });
  };

  const saveSelectedTagHandler = (inputValue) => {
    setCardData((prevState) => {
      return updateObject(prevState, {
        selectedTags: inputValue,
      });
    });
    saveInput("selectedTags", inputValue);
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

    setReqActionError(null);
    axios
      .post(url, attachmentData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCardData(res.data.card);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err.message;
        setReqActionError(message);
        setTimeout(() => {
          setReqActionError(null);
        }, 4000);
      });
  };

  const deleteAttachmentHandler = (attachmentId) => {
    axios
      .delete(`card/${cardId}/attachment/${attachmentId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setCardData(res.data.card);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearActionError = () => {
    setReqActionError(null);
  };

  const changeActiveModal = (activeModal) => {
    setActiveModal(activeModal);
  };

  const closeModalHandler = () => {
    setActiveModal(null);
  };

  const backToBoard = () => {
    history.replace(`/board/${cardData.boardId}`);
  };

  let cardElement = <Spinner color="primary" />;
  if (cardData) {
    cardElement = (
      <>
        <div className={classes.CardButton}>
          <Button
            clicked={backToBoard}
            variant="outlined"
            color="secondary"
            type="button"
          >
            <IoArrowBackOutline />
            Volver al tablero
          </Button>
        </div>

        <div className={classes.CardHeader}>
          <Name name={cardData.name} inputSaveName={saveInput} />
        </div>

        <div className={classes.CardBody}>
          <div className={classes.MainContent}>
            <Tag
              boardId={cardData.boardId}
              selectedTags={cardData.selectedTags}
              isModalOpen={activeModal === "tag"}
              openModal={changeActiveModal}
              closeModal={closeModalHandler}
              onSaveSelectedTag={saveSelectedTagHandler}
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
              reqError={reqActionError}
              closeErrorAlert={clearActionError}
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
              loading={reqDeleteLoading}
            />
          </div>

          <Actions toggleModal={changeActiveModal} />
        </div>
      </>
    );
  } else if (reqError) {
    cardElement = <Alert>{reqError}</Alert>;
  }

  return <div className={classes.Card}>{cardElement}</div>;
};

export default Card;
