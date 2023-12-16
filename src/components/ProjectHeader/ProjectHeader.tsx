import CycloneIcon from "@mui/icons-material/Cyclone";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { logOut } from "../../store/features/authSlice";
import { useAppDispatch } from "../../store/store";

export const ProjectHeader = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <AppBar position="static">
    <Container>
      <Toolbar>
        <Box
          sx={{
            display: { xs: "flex", md: "flex" },
            mr: 1,
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CycloneIcon
            sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "flex" },
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            endToEnd
          </Typography>
        </Box>
        <Box>
          <Button color="inherit" onClick={handleLogout} >LOGOUT</Button>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  );
};
