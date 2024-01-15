import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { logOut } from "../../store/features/authSlice";
import { useAppDispatch } from "../../store/store";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("projectsPage");

  const handleLogout = () => {
    dispatch(logOut());
  };
  return (
    <Button sx={{ color: "#fff" }} onClick={handleLogout}>
      {t("logout")}
    </Button>
  );
}
