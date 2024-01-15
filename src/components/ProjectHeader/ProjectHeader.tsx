import CycloneIcon from "@mui/icons-material/Cyclone";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { logOut } from "../../store/features/authSlice";
import { useAppDispatch } from "../../store/store";
import { LangToggle } from "../LangToggle/LangToggle";
import LogoutButton from "../LogoutButton/LogoutButton";

export const ProjectHeader = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };
  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Box
            display={{ xs: "none", sm: "flex" }}
            sx={{
              mr: 1,
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                mr: 1,
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <CycloneIcon
                sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }}
              />
              <Typography
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
              <Typography>{localStorage.getItem("userEmail")}</Typography>
            </Box>
            <LogoutButton />
            <LangToggle />
          </Box>

          <SwipeableDrawer
            open={isOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{
                height: "100vh",
                p: 2,
                backgroundColor: "#1976d2",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start ",
              }}
            >
              <Typography sx={{ color: "#fff" }}>
                {localStorage.getItem("userEmail")}
              </Typography>

              <LangToggle />
            </Box>
          </SwipeableDrawer>

          <Box
            display={{ xs: "flex", sm: "none" }}
            sx={{ justifyContent: "space-between", width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CycloneIcon
                sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }}
              />
              <Typography
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
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <LogoutButton />
              <Button sx={{ color: "white" }} onClick={toggleDrawer(true)}>
                <MenuIcon />
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
