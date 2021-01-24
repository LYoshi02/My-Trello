import React, { useState } from "react";
import { IoAttachOutline } from "react-icons/io5";

import AttachmentComponent from "../../../components/Card/Sections/Attachments/Attachment/attachment";
import AttachmentsModal from "../../../components/Card/Sections/Attachments/AttachmentsModal/attachmentsModal";
import Button from "../../../components/UI/Button/button";
import CardHeading from "../../../components/Card/Heading/heading";
import Modal from "../../../components/Card/Modal/modal";
import { updateObject } from "../../../util/helpers";

const Attachment = ({
  isModalOpen,
  onCloseModal,
  fetchedAttachments,
  onCreateAttachment,
  onDeleteAttachment,
  onEditAttachment,
}) => {
  const [linkData, setLinkData] = useState({
    name: "",
    url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (!editingId) {
      if (linkData.url.trim() !== "") {
        const newAttachment = {
          ...linkData,
          type: "link",
        };
        onCreateAttachment(newAttachment, "link");
        closeModalHandler();
      }
    } else {
      const updatedAttachments = [...fetchedAttachments];
      const changedAttachmentIndex = fetchedAttachments.findIndex(
        (att) => att._id === editingId
      );
      const newName = linkData.name.trim();

      if (fetchedAttachments[changedAttachmentIndex].name !== newName) {
        const updatedAttachment = updateObject(
          fetchedAttachments[changedAttachmentIndex],
          { name: newName }
        );
        updatedAttachments.splice(changedAttachmentIndex, 1, updatedAttachment);
        onEditAttachment("attachments", updatedAttachments);
      }
      closeModalHandler();
    }
  };

  const fileUploadHandler = (event) => {
    const data = new FormData();
    data.append("attachedFile", event.target.files[0]);
    onCreateAttachment(data, "file");
    closeModalHandler();
  };

  const closeModalHandler = () => {
    setLinkData({ name: "", url: "" });
    setEditingId(null);
    onCloseModal();
  };

  const openEditorModal = (id) => {
    const { name, type } = fetchedAttachments.find(
      (att) => att._id.toString() === id
    );
    setLinkData({ name, type });
    setEditingId(id);
  };

  const linkInputChangedHandler = (value, type) => {
    setLinkData((prevState) => {
      return {
        ...prevState,
        [type]: value,
      };
    });
  };

  const deleteAttachmentHandler = () => {
    onDeleteAttachment(deletingId);
    setDeletingId(null);
  };

  let modal = null;
  if (isModalOpen || editingId) {
    modal = (
      <AttachmentsModal
        inputData={linkData}
        isEditing={editingId !== null}
        onClose={closeModalHandler}
        onSubmitForm={submitFormHandler}
        onFileUpload={fileUploadHandler}
        onInputChanged={linkInputChangedHandler}
      />
    );
  } else if (deletingId) {
    modal = (
      <Modal close={() => setDeletingId(null)}>
        <h2>¿Desea eliminar el adjunto?</h2>
        <p>
          La operación de eliminar un adjunto es permanente. No es posible
          deshacer la operación
        </p>
        <Button
          clicked={deleteAttachmentHandler}
          type="button"
          variant="contained"
          color="secondary"
        >
          Eliminar
        </Button>
      </Modal>
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
          {fetchedAttachments.map((item) => (
            <AttachmentComponent
              key={item._id}
              data={item}
              onDelete={(id) => setDeletingId(id)}
              onEdit={openEditorModal}
            />
          ))}
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
