import { Box } from "@mui/material";
import React from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import { ScoketContext } from "../BoardTaskList/BoardTaskList";
import { DndColumn } from "./DndColumn";
import { Task, TaskStatus, statusIdToStatus } from "./data";

export const columns = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];
export const DndMain = ({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: any;
}) => {
  const onDragStart = (start: DragStart) => {};
  const socket = React.useContext(ScoketContext);
  const sprintId = useSelector(selectedSprintIdSelector);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const taskId = result.draggableId;
    const newStatus = result.destination?.droppableId;

    const task = tasks.find((t) => t.id === taskId);

    let statusId = columns.findIndex((el) => el === newStatus) + 1;

    const updatedTask = {
      id: taskId,
      title: task?.title,
      desc: task?.desc,
      sprintId: sprintId,
      statusId: statusId,
    };

    socket.emit("editTask", updatedTask);

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          task.status = statusIdToStatus[statusId];
        }

        return task;
      })
    );
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Box display={"flex"}  sx={{ gap: "25px" }} >
        {columns.map((status, index) => (
          <DndColumn
            tasks={tasks.filter((task) => task.status === status)}
            columnName={status}
            index={index}
            key={status}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};
