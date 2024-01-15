import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Divider, Typography } from "@mui/material";
import LogoutButton from "../components/LogoutButton/LogoutButton";

export const EmailVerification = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "520px",
        width: "100%",
        height: "90vh",
        margin: "0 auto",
        justifyContent: "center",
        p: "10px"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CheckCircleOutlineIcon style={{ color: "#54a92c" }} />
        <Typography variant="body1" fontSize={"20px"}>
          A verification link has been sent to your email account
        </Typography>
      </Box>
      <Divider orientation="horizontal" flexItem />
      <Typography fontSize={"12px"} variant="body2">
        Please click on the button that has just been sent to your email account
        to verify your email and continue the registration process.
      </Typography>

      <Box
        sx={{
          mt: "20px",
          backgroundColor: "#7aacbb",
          display: "inline-block",
          borderRadius: "6px",

        }}
      >
        <LogoutButton />
      </Box>
    </Box>
  );
};
