import React from "react";

import classes from "./attachment.module.scss";

const AttachmentComponent = ({ data, onDelete, onEdit }) => {
  let url = data.url;
  if (data.type !== "link") {
    url = "http://localhost:8080" + data.url;
  }

  const isImage =
    data.type === "jpg" || data.type === "jpeg" || data.type === "png";

  return (
    <div
      className={classes.Thumbnail}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      <div className={classes.ThumbnailType}>
        <p>{isImage ? <img src={url} alt={data.name} /> : data.type}</p>
      </div>

      <div className={classes.ThumbnailContent}>
        <p>{data.name || data.url}</p>

        <div className={classes.ThumbnailActions}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEdit(data._id);
            }}
          >
            Editar
          </span>{" "}
          {" - "}
          <span
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data._id);
            }}
          >
            Eliminar
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttachmentComponent;
