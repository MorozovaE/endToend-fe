import { Box, Drawer } from "@mui/material";
import { BoardDrawer } from "../BoardDrawer/BoardDrawer";
const drawerWidth = 240;

export const BoardSideNav = ({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: any;
}) => {
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <BoardDrawer setMobileOpen={setMobileOpen} />
      </Drawer>
      {/* //second */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        <BoardDrawer setMobileOpen={setMobileOpen} />
      </Drawer>
    </Box>
  );
};
