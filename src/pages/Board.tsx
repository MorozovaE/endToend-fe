import { Box } from "@mui/material";
import { BoardHeader } from "../components/BoardHeader/BoardHeader";
import { BoardSideNav } from "../components/BoardSideNav/BoardSideNav";
import { BoardTaskList } from "../components/BoardTaskList/BoardTaskList";

const drawerWidth = 240;

export const Board = () => {
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
      }}
    >
      <BoardHeader />
      <BoardSideNav />
      <BoardTaskList />
    </Box>
  );
};
