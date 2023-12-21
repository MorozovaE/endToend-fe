import CycloneIcon from "@mui/icons-material/Cyclone";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { logOut } from "../../store/features/authSlice";
import { useAppDispatch } from "../../store/store";
import { LangToggle } from "../LangToggle/LangToggle";

export const ProjectHeader = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("projectsPage");

  const handleLogout = () => {
    dispatch(logOut());
  };

  interface Locales {
    [language: string]: {
      title: string;
    };
  }

  const locales: Locales = {
    en: {
      title: "English",
    },
    ru: {
      title: "Русский",
    },
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
            <CycloneIcon sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }} />
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
            <Typography>{localStorage.getItem("userEmail")}</Typography>
          </Box>

          <LangToggle />

          <Box>
            <Button color="inherit" onClick={handleLogout}>
              {t("logout")}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
