import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/material";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import {
  openCreateTaskDialog,
  taskDialogTypeSelector,
} from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { DndMain } from "../Dnd/DndMain";
import { Task, stringToStatus } from "../Dnd/data";
import { CreateTaskDialog } from "../TaskDialog/CreateTaskDialog";
import { EditTaskDialog } from "../TaskDialog/EditTaskDialog";

let socket = io("ws://localhost:3001", {
  autoConnect: false,
  extraHeaders: {
    Authorization: localStorage.getItem("token") as any,
  },
});

export const ScoketContext = createContext(socket);

export const BoardTaskList = () => {
  const { t } = useTranslation("boardPage");

  const dispatch = useAppDispatch();
  const dialogType = useSelector(taskDialogTypeSelector);
  const sprintId = useSelector(selectedSprintIdSelector);
  const [tasks, setTasks] = React.useState([]);

  function convertToTask(task: any): Task {
    const newTask = {
      id: String(task.id),
      title: task.title,
      desc: task.desc,
      status: stringToStatus[task.status.name],
      sprint: String(sprintId),
    };

    return newTask;
  }

  React.useEffect(() => {
    socket.connect();

    socket.on("tasks", (tasks: any) => {
      setTasks(tasks.map(convertToTask));
    });
  }, []);

  React.useEffect(() => {
    if (sprintId) {
      socket.emit("subscribeToSprint", sprintId);
      socket.emit("getTasks", sprintId);
    }
  }, [sprintId]);

  const handleClickOpen = () => {
    dispatch(openCreateTaskDialog());
  };
  return (
    <ScoketContext.Provider value={socket}>
      <div>
        {sprintId && (
          <Button onClick={handleClickOpen}>
            {t("createTask")}
            <AddOutlinedIcon />
          </Button>
        )}
        {dialogType === "create" ? (
          <CreateTaskDialog />
        ) : dialogType === "edit" ? (
          <EditTaskDialog />
        ) : (
          ""
        )}
        <DndMain tasks={tasks} />
      </div>
    </ScoketContext.Provider>
  );
};
