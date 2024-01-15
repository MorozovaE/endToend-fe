import { Box, Typography } from "@mui/material";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { DndTask } from "./DndTask";
import { Task } from "./data";

export const DndColumn = ({
  columnName,
  tasks,
  index,
}: {
  columnName: string;
  tasks: Task[];
  index: number;
}) => {

  return (
    <Box
      sx={{
        bgcolor: "#e6e6e6",
        p: 3,
        height: "78vh",
        width: "450px",
        overflow: "hidden",
      }}
    >
      <Typography
        gutterBottom
        variant="h3"
        component="div"
        sx={{ m: 1, textAlign: "center" }}
      >
        {columnName}
      </Typography>
      <Droppable droppableId={columnName}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <Box
            ref={provided.innerRef}
            sx={{ overflow: "auto", height: "78vh", width: "100%" }}
          >
            {tasks.map((task, taskIndex) => (
              task ? <DndTask task={task} index={taskIndex} key={task.id} /> : ""
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};
