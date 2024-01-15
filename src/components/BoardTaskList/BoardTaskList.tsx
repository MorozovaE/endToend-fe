import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Button, Toolbar, useMediaQuery, useTheme } from "@mui/material";
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
import { Task, statusIdToStatus } from "../Dnd/data";
import { Loader } from "../Loader/Loader";
import { CreateTaskDialog } from "../TaskDialog/CreateTaskDialog";
import { EditTaskDialog } from "../TaskDialog/EditTaskDialog";

let socket = io("ws://localhost:3001", {
  autoConnect: false,
  extraHeaders: {
    Authorization: localStorage.getItem("token") as any,
  },
});

export type GroupedTasks = {
  TODO: Task[];
  IN_PROGRESS: Task[];
  DONE: Task[];
};

export const SocketContext = createContext(socket);

export const BoardTaskList = () => {
  const { t } = useTranslation("boardPage");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useAppDispatch();
  const dialogType = useSelector(taskDialogTypeSelector);
  const sprintId = useSelector(selectedSprintIdSelector);
  const sprintIdRef = React.useRef(sprintId);

  const sprintLoading = useSelector(selectedSprintLoading);
  const { projectId } = useParams();
  const [tasks, setTasks] = React.useState([]);

  const [groupedTasks, setGroupedTasks] = React.useState<GroupedTasks>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const tasksRef = React.useRef(groupedTasks);

  React.useEffect(() => {
    tasksRef.current = groupedTasks;
  }, [groupedTasks]);

  React.useEffect(() => {
    sprintIdRef.current = sprintId;
  }, [sprintId]);

  function convertToTask(task: any): Task {
    const newTask = {
      id: String(task.id),
      title: task.title,
      desc: task.desc,
      status: statusIdToStatus[task.status.id],
      sprint: String(sprintId),
    };

    return newTask;
  }

  function groupTasks(tasks: any) {
    let groupedTasks: GroupedTasks = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (let task of tasks) {
      const convertedTask = convertToTask(task);

      // groupedTasks[convertedTask.status].push(convertedTask);
      groupedTasks[convertedTask.status][task.order] = convertedTask;
    }

    return groupedTasks;
  }

  React.useEffect(() => {
    socket.connect();

    const onGetTasks = (tasks: any) => {
      setGroupedTasks(groupTasks(tasks));
      dispatch(setSprintLoading(false));
    };

    const onEditTask = (updatedTask: {
      updatedTask: any;
      reorderInfo: {
        fromIndex: number;
        toIndex: number;

        fromStatus: number;
        toStatus: number;

        fromSprint: number;
        toSprint: number;
        taskId: number;
      };
    }) => {
      const { reorderInfo } = updatedTask;
      const newTask = updatedTask.updatedTask;

      let newGroupedTasks;
      let groupedTasks = tasksRef.current;

      const fromStatus = statusIdToStatus[reorderInfo.fromStatus];
      const toStatus = statusIdToStatus[reorderInfo.toStatus];

      const sourceColumn = (groupedTasks as any)[String(fromStatus)];
      const destColumn = (groupedTasks as any)[String(toStatus)];

      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];

      if (
        reorderInfo.fromIndex == reorderInfo.toIndex &&
        reorderInfo.fromStatus == reorderInfo.toStatus &&
        reorderInfo.fromSprint == reorderInfo.toSprint
      ) {
        let task = sourceItems[reorderInfo.fromIndex];
        task.title = newTask.title;
        task.desc = newTask.desc;

        newGroupedTasks = {
          ...groupedTasks,
          [fromStatus]: sourceItems,
        };

        setGroupedTasks(newGroupedTasks);
      }

      if (
        reorderInfo.fromSprint != reorderInfo.toSprint &&
        reorderInfo.toSprint == sprintIdRef.current
      ) {
        destItems.splice(reorderInfo.toIndex, 0, convertToTask(newTask));

        newGroupedTasks = {
          ...groupedTasks,
          [toStatus]: destItems,
        };
        setGroupedTasks(newGroupedTasks);
        return;
      }

      if (
        reorderInfo.fromSprint != reorderInfo.toSprint &&
        reorderInfo.toSprint != sprintIdRef.current
      ) {
        sourceItems.splice(reorderInfo.fromIndex, 1);

        newGroupedTasks = {
          ...groupedTasks,
          [fromStatus]: sourceItems,
        };
        setGroupedTasks(newGroupedTasks);
        return;
      }

      if (destItems[reorderInfo.toIndex]?.id == reorderInfo.taskId) return;

      if (sourceItems[reorderInfo.fromIndex]?.id != reorderInfo.taskId) return;

      if (
        reorderInfo.fromSprint == reorderInfo.toSprint &&
        reorderInfo.fromStatus == reorderInfo.toStatus
      ) {
        
        let removed = sourceItems.splice(reorderInfo.fromIndex, 1)[0] as Task;
        removed.title = newTask.title;
        removed.desc = newTask.desc;
        removed.status = toStatus;

        sourceItems.splice(reorderInfo.toIndex, 0, removed);

        newGroupedTasks = {
          ...groupedTasks,
          [fromStatus]: sourceItems,
        };
        setGroupedTasks(newGroupedTasks);
        return;
      }

      let removed = sourceItems.splice(reorderInfo.fromIndex, 1)[0] as Task;
      removed.title = newTask.title;
      removed.desc = newTask.desc;
      removed.status = toStatus;

      destItems.splice(reorderInfo.toIndex, 0, removed);

      newGroupedTasks = {
        ...groupedTasks,
        [fromStatus]: sourceItems,
        [toStatus]: destItems,
      };

      setGroupedTasks(newGroupedTasks);
      dispatch(setSprintLoading(false));
    };

    socket.on("tasks", onGetTasks);
    socket.on("editTask", onEditTask);

    return () => {
      socket.off("tasks", onGetTasks);
      socket.off("editTask", onEditTask);
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (projectId) {
      socket.emit("subscribeToSprint", { sprintId, projectId });

      socket.emit("getTasks", { sprintId, projectId }, (tasks: any) => {
        setGroupedTasks(groupTasks(tasks));
        dispatch(setSprintLoading(false));
      });
    }
  }, [sprintId]);

  const handleClickOpen = () => {
    dispatch(openCreateTaskDialog());
  };
  return (
    <SocketContext.Provider value={socket}>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Button
          onClick={handleClickOpen}
          sx={{
            m: "15px 15px 0 15px",
            flexShrink: 0,
          }}
        >
          {t("createTask")}
          <AddOutlinedIcon />
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          m: "15px 15px 0 15px",
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
          !matches ? (
            <DndMain
              tasks={tasks}
              groupedTasks={groupedTasks}
              setGroupedTasks={setGroupedTasks}
              setTasks={setTasks}
            />
          ) : (
            <BacklogList groupedTasks={groupedTasks} />
          )
        ) : (
          <BacklogList groupedTasks={groupedTasks} />
        )}
      </Box>
    </SocketContext.Provider>
  );
};
