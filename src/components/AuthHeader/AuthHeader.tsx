import { AppBar, Box } from "@mui/material";
import { LangToggle } from "../LangToggle/LangToggle";

export const AuthHeader = () => {
  return (
    <AppBar>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: "20px" }}>
        <Box width={"100px"}>
          <LangToggle />
        </Box>
      </Box>
    </AppBar>
  );
};
