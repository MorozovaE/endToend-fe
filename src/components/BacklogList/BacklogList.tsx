import { Box } from "@mui/material";
import { Task } from "../Dnd/data";
import { BacklogTask } from "./BacklogTask";

export const BacklogList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <Box>
      {tasks.map((task, i) => (
        <BacklogTask task={task} key={i} />
      ))}
    </Box>
  );
};
