import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import {
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import { openEditTaskDialog } from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { SocketContext } from "../BoardTaskList/BoardTaskList";
import { Task } from "./data";

export const DndTask = ({ task, index }: { task: Task; index: number }) => {
  const dispatch = useAppDispatch();
  const socket = React.useContext(SocketContext);
  const sprintId = useSelector(selectedSprintIdSelector);
  const { projectId } = useParams();

  const handleEditTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(openEditTaskDialog({ id: task.id }));
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    socket.emit("deleteTask", {taskId: task.id, sprintId});
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Card
          sx={{
            width: "80%",
            height: 50,
            p: 3,
            m: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Typography>{task.title}</Typography>
          <Box>
            <IconButton onClick={handleEditTask}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
        </Card>
      )}
    </Draggable>
  );
};
