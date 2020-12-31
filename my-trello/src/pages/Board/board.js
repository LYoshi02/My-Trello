import React from "react";

import classes from "./board.module.scss";

const Board = () => {
  return (
    <div className={classes.Board}>
      <div className={classes.TaskList}>
        <h3>Lista de tareas</h3>
        <div className={classes.Tasks}>
          <div className={classes.Task}>
            <p>Task name</p>
          </div>
        </div>
      </div>

      <div className={classes.TaskList}>
        <h3>En Proceso</h3>
        <div className={classes.Tasks}>
          <div className={classes.Task}>
            <p>Task name</p>
          </div>
        </div>
      </div>

      <div className={classes.TaskList}>
        <h3>Finalizado</h3>
        <div className={classes.Tasks}>
          <div className={classes.Task}>
            <p>Task name</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
