import React, { useState } from "react";
import { IoAttachOutline } from "react-icons/io5";

import AttachmentComponent from "../../../components/Card/Sections/Attachments/Attachment/attachment";
import AttachmentsModal from "../../../components/Card/Sections/Attachments/AttachmentsModal/attachmentsModal";
import CardHeading from "../../../components/Card/Heading/heading";
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

  const submitFormHandler = (event) => {
    event.preventDefault();
    if (!editingId) {
      const newAttachment = {
        ...linkData,
        type: "link",
      };
      onCreateAttachment(newAttachment);
    } else {
      const updatedAttachments = [...fetchedAttachments];
      const changedAttachmentIndex = fetchedAttachments.findIndex(
        (att) => att._id === editingId
      );

      if (
        fetchedAttachments[changedAttachmentIndex].name !== linkData.name.trim()
      ) {
        const updatedAttachment = updateObject(
          fetchedAttachments[changedAttachmentIndex],
          { name: linkData.name }
        );
        updatedAttachments.splice(changedAttachmentIndex, 1, updatedAttachment);
        onEditAttachment("attachments", updatedAttachments);
      }
    }

    closeModalHandler();
  };

  const fileUploadHandler = (event) => {
    const data = new FormData();
    data.append("attachedFile", event.target.files[0]);
    onCreateAttachment(data);
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
              onDelete={onDeleteAttachment}
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
