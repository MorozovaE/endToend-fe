import { Box } from "@mui/material";
import React from "react";
import { BoardHeader } from "../components/BoardHeader/BoardHeader";
import { BoardSideNav } from "../components/BoardSideNav/BoardSideNav";
import { BoardTaskList } from "../components/BoardTaskList/BoardTaskList";

const drawerWidth = 240;

export const Board = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: { xs: 0, sm: `${drawerWidth}px` },
      }}
    >
      <BoardHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <BoardSideNav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <BoardTaskList />
    </Box>
  );
};
