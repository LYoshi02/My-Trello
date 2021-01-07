import React from "react";
import Backdrop from "../../UI/Backdrop/backdrop";

import classes from "./modal.module.scss";

const CardModal = (props) => {
  return (
    <div className={classes.CardModal}>
      <div className={classes.ModalContent}>{props.children}</div>
      <Backdrop clicked={props.close} />
    </div>
  );
};

export default CardModal;
