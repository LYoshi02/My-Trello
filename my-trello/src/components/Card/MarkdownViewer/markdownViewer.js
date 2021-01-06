import React from "react";
import ReactMarkdown from "react-markdown";

import classes from "./markdownViewer.module.scss";

const MarkdownViewer = (props) => {
  const { openEditor, description } = props;

  let markdownElement = (
    <p className={classes.MarkdownLink}>
      Añadir una descripción más detallada...
    </p>
  );
  if (description) {
    markdownElement = (
      <ReactMarkdown
        className={classes.Markdown}
        children={description}
        linkTarget="_blank"
      />
    );
  }

  return (
    <div className={classes.MarkdownViewer} onClick={openEditor}>
      {markdownElement}
    </div>
  );
};

export default MarkdownViewer;
