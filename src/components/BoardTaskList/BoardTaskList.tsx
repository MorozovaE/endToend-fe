import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Button } from "@mui/material";
import React, { Suspense, createContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  selectedSprintIdSelector,
  selectedSprintLoading,
  setSprintLoading,
} from "../../store/features/sprintsSlice";
import {
  openCreateTaskDialog,
  taskDialogTypeSelector,
} from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { BacklogList } from "../BacklogList/BacklogList";
import { DndMain } from "../Dnd/DndMain";
import { Task, stringToStatus } from "../Dnd/data";
import { Loader } from "../Loader/Loader";
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
  const sprintLoading = useSelector(selectedSprintLoading);
  const { projectId } = useParams();
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
      dispatch(setSprintLoading(false));
    });
  }, []);

  React.useEffect(() => {
    if (projectId) {
      socket.emit("subscribeToSprint", { sprintId, projectId });

      socket.emit("getTasks", { sprintId, projectId }, (tasks: any) => {
        setTasks(tasks.map(convertToTask));
        dispatch(setSprintLoading(false));
      });
    }
  }, [sprintId]);

  const handleClickOpen = () => {
    dispatch(openCreateTaskDialog());
  };
  return (
    <ScoketContext.Provider value={socket}>
      <Box
        sx={{
          p: "15px 15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button onClick={handleClickOpen}>
            {t("createTask")}
            <AddOutlinedIcon />
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          {dialogType === "create" ? (
            <Suspense fallback={<Loader />}>
              <CreateTaskDialog />
            </Suspense>
          ) : dialogType === "edit" ? (
            <Suspense fallback={<Loader />}>
              <EditTaskDialog />
            </Suspense>
          ) : (
            ""
          )}
          {sprintLoading ? (
            <Loader />
          ) : sprintId ? (
            <DndMain tasks={tasks} setTasks={setTasks} />
          ) : (
            <BacklogList tasks={tasks} />
          )}
        </Box>
      </Box>
    </ScoketContext.Provider>
  );
};
