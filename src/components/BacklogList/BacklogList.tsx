import { Box } from "@mui/material";
import { GroupedTasks } from "../BoardTaskList/BoardTaskList";
import { Task } from "../Dnd/data";
import { BacklogTask } from "./BacklogTask";

export const BacklogList = ({
  groupedTasks,
}: {
  groupedTasks: GroupedTasks;
}) => {

  function flatTasks(groupedTasks: GroupedTasks): Task[] {
    return Object.entries(groupedTasks)
      .map(([_, task]) => {
        return task;
      })
      .flat()
  }

  return (
    <Box>
      {flatTasks(groupedTasks)
        .map((task, i) => (
          <BacklogTask task={task} key={i} />
        ))}
    </Box>
  );
};
