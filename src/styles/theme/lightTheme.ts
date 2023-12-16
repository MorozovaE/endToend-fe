import { createTheme } from "@mui/material/styles";

export const primaryColor = "#bcb0a4";
export const primaryBackground = "#FFE9D6";
export const secondaryLightColor = "#727272";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  // shadows: [
  //   "none",
  //   "0px 1px 18px 2px rgb(66 56 56 / 20%), 0px 1px 1px 0px rgb(248 148 148 / 13%),0px 1px 3px 0px rgba(0,0,0,0.12)",
  // ],

  palette: {
    mode: "light",
    // primary: {
    //   main: primaryColor,
    //   light: "rgba(255, 122, 0, 0.5)",
    //   contrastText: "#ffffff",
    // },
  },
  typography: {
    body1: {
      fontSize: "16px",
      fontWeight: 400,
    },
    body2: {
      fontSize: "16px",
      fontWeight: 400,
      color: "#918d8d",
    },
  }
});
