import React, { useState, useEffect } from "react";
import { IoAttachOutline } from "react-icons/io5";
import CardHeading from "../../../components/Card/Heading/heading";

import CardModal from "../../../components/Card/Modal/modal";
import Button from "../../../components/UI/Button/button";

import classes from "./attachment.module.scss";

const Attachment = ({
  isModalOpen,
  onCloseModal,
  onSaveAttachment,
  fetchedAttachments,
  onUploadFile,
}) => {
  const [attachments, setAttachments] = useState([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");

  useEffect(() => {
    if (fetchedAttachments) {
      setAttachments(fetchedAttachments);
    }
  }, [fetchedAttachments]);

  const submitFormHandler = (event) => {
    event.preventDefault();
    const newAttachment = {
      name: linkName,
      url: linkUrl,
      type: "link",
    };
    const updatedAttachments = [...attachments, newAttachment];
    onSaveAttachment("attachments", updatedAttachments);
    closeModalHandler();
  };

  const fileChangeHandler = (event) => {
    const data = new FormData();
    data.append("attachedFile", event.target.files[0]);
    onUploadFile(data);
  };

  const closeModalHandler = () => {
    setLinkUrl("");
    setLinkName("");
    onCloseModal();
  };

  let modal = null;
  if (isModalOpen) {
    modal = (
      <CardModal close={closeModalHandler}>
        <h2>Adjuntar a partir de...</h2>

        <form onSubmit={submitFormHandler}>
          <div>
            <input
              type="file"
              name="attachedFile"
              onChange={fileChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="link">Adjuntar un enlace:</label>
            <input
              type="url"
              id="link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="link-name">Nombre del enlace (opcional):</label>
            <input
              type="text"
              id="link-name"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
            />
          </div>

          <Button type="submit">Adjuntar</Button>
        </form>
      </CardModal>
    );
  }

  let attachmentElements = null;
  if (fetchedAttachments && fetchedAttachments.length > 0) {
    attachmentElements = (
      <div>
        <CardHeading>
          <IoAttachOutline />
          <h2>Adjuntos</h2>
        </CardHeading>

        <div>
          {fetchedAttachments.map((item) => {
            let url = item.url;
            if (item.type !== "link") {
              url = "http://localhost:8080" + item.url;
            }

            return (
              <div className={classes.Thumbnail} key={item._id}>
                <div className={classes.ThumbnailType}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {item.type}
                  </a>
                </div>

                <div className={classes.ThumbnailContent}>
                  <p>{item.name || item.url}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {modal}
      {attachmentElements}
    </>
  );
};

export default Attachment;
