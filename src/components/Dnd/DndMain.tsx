import { Box } from "@mui/material";
import React from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import { GroupedTasks, SocketContext } from "../BoardTaskList/BoardTaskList";
import { DndColumn } from "./DndColumn";
import { Task, TaskStatus } from "./data";

export const columns = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];

export const DndMain = ({
  tasks,
  setTasks,
  groupedTasks,
  setGroupedTasks,
}: {
  tasks: Task[];
  setTasks: any;
  groupedTasks: GroupedTasks;
  setGroupedTasks: any;
}) => {
  const onDragStart = (start: DragStart) => {};
  const socket = React.useContext(SocketContext);
  const sprintId = useSelector(selectedSprintIdSelector);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
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
      order: result.destination.index,
    };

    const { source, destination } = result;
    let newGroupedTasks;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = (groupedTasks as any)[source.droppableId];
      const destColumn = (groupedTasks as any)[destination.droppableId];

      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];

      let [removed] = sourceItems.splice(source.index, 1);

      removed.status = destination?.droppableId;

      destItems.splice(destination.index, 0, removed);

      newGroupedTasks = {
        ...groupedTasks,
        [source.droppableId]: sourceItems,

        [destination.droppableId]: destItems,
      };
    } else {
      const column = (groupedTasks as any)[source.droppableId];
      const copiedItems = [...column];
      let [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      newGroupedTasks = {
        ...groupedTasks,
        [source.droppableId]: copiedItems,
      };
    }

    setGroupedTasks(newGroupedTasks);

    socket.emit("editTask", updatedTask);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Box display={"flex"} sx={{ gap: "25px", overflow: "hidden" }}>
        {columns.map((status, index) => (
          <DndColumn
            tasks={groupedTasks[status]}
            columnName={status}
            index={index}
            key={status}
          />
        ))}
      </Box>
    </DragDropContext>
  );
};
