import React, { useState, useEffect } from "react";
import axios from "../../axios-instance";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import classes from "./board.module.scss";

const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      name: "Task 1",
    },
    "task-2": {
      id: "task-2",
      name: "Task 2",
    },
    "task-3": {
      id: "task-3",
      name: "Task 3",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Lista de Tareas",
      taskIds: ["task-1", "task-2", "task-3"],
    },
    "column-2": {
      id: "column-2",
      title: "En Proceso",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Finalizado",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const Board = (props) => {
  const [lists, setLists] = useState(initialData);
  const [taskName, setTaskName] = useState("");
  const [columnCreateTask, setColumnCreateTask] = useState("");

  // console.log(props);
  useEffect(() => {
    axios
      .get(`board/${props.match.params.boardId}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const dragEndHandler = (result) => {
    if (!result.destination) return;

    const start = lists.columns[result.source.droppableId];
    const finish = lists.columns[result.destination.droppableId];
    let updatedList;

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(result.source.index, 1);
      newTaskIds.splice(result.destination.index, 0, result.draggableId);

      const newColumn = {
        ...start,
        taskIds: [...newTaskIds],
      };

      updatedList = {
        ...lists,
        columns: {
          ...lists.columns,
          [newColumn.id]: newColumn,
        },
      };
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(result.source.index, 1);

      const newStartColumn = {
        ...start,
        taskIds: [...startTaskIds],
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(result.destination.index, 0, result.draggableId);

      const newFinishColumn = {
        ...finish,
        taskIds: [...finishTaskIds],
      };

      updatedList = {
        ...lists,
        columns: {
          ...lists.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        },
      };
    }

    setLists(updatedList);
  };

  const toggleTaskCreator = (listId) => {
    setTaskName("");
    setColumnCreateTask(listId);
  };

  const createTask = () => {
    console.log("Task name: ", taskName);
    console.log("Column name: ", columnCreateTask);
    const taskNumber = Math.random();
    const newTask = {
      id: `task-${taskNumber}`,
      name: taskName,
    };

    const updatedList = {
      ...lists,
      tasks: {
        ...lists.tasks,
        [`task-${taskNumber}`]: newTask,
      },
      columns: {
        ...lists.columns,
        [columnCreateTask]: {
          ...lists.columns[columnCreateTask],
          taskIds: [...lists.columns[columnCreateTask].taskIds, newTask.id],
        },
      },
    };

    setLists(updatedList);
    toggleTaskCreator("");
  };

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className={classes.Container}>
        <div className={classes.Board}>
          {lists.columnOrder.map((colName) => (
            <div className={classes.TaskList} key={lists.columns[colName].id}>
              <div className={classes.TaskContent}>
                <div>
                  <h3>{lists.columns[colName].title}</h3>
                </div>

                <Droppable droppableId={lists.columns[colName].id}>
                  {(provided) => (
                    <div
                      className={classes.Tasks}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {lists.columns[colName].taskIds.map((taskId, index) => (
                        <Draggable
                          key={lists.tasks[taskId].id}
                          draggableId={lists.tasks[taskId].id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className={classes.Task}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <p>{lists.tasks[taskId].name}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columnCreateTask === colName ? (
                        <div className={classes.NewTask}>
                          <textarea
                            placeholder="Introduzca un titulo para la tarea"
                            rows="3"
                            value={taskName}
                            onChange={(event) =>
                              setTaskName(event.target.value)
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </div>
                  )}
                </Droppable>

                <div className={classes.TaskAction}>
                  {columnCreateTask === colName ? (
                    <div>
                      <button type="button" onClick={createTask}>
                        Crear Tarea
                      </button>
                      <IoCloseOutline onClick={() => toggleTaskCreator("")} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleTaskCreator(colName)}
                    >
                      <IoAddOutline />
                      Añada otra tarea
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
