import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import { openEditTaskDialog } from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { ScoketContext } from "../BoardTaskList/BoardTaskList";
import { Task } from "../Dnd/data";

export const BacklogTask = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch();
  const socket = React.useContext(ScoketContext);
  const sprintId = useSelector(selectedSprintIdSelector);

  const handleEditTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(openEditTaskDialog({ id: task.id }));
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    socket.emit("deleteTask", { taskId: task.id, sprintId });
  };
  return (
    <Card
      sx={{
        maxWidth: "350px",
        height: 50,
        p: 3,
        m: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box>
          <Typography>{task.title}</Typography>
        </Box>
        <Box
          sx={{
            p: "5px 15px",
            backgroundColor: "#eee",
            textAlign: "center",
            borderRadius: "10px",
            fontSize: "0.7rem",
          }}
        >
          <Typography>{task.status}</Typography>
        </Box>
      </Box>
      <Box>
        <IconButton onClick={handleEditTask}>
          <EditOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
    </Card>
  );
};
