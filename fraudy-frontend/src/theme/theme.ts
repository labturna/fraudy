// src/theme/theme.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  typography: {
    fontFamily: "Aldrich, sans-serif",
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#1976d2" },
          secondary: { main: "#f48fb1" },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          text: {
            primary: "#1e1e1e",
            secondary: "#4f5b62",
          },
        }
      : {
          primary: { main: "#90caf9" },
          secondary: { main: "#f48fb1" },
          background: {
            default: "#0f2027",
            paper: "#A9B5DF",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b0bec5",
          },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            mode === "dark"
              ? "linear-gradient(135deg, rgb(45, 49, 107) 0%, rgb(120, 128, 199) 100%)"
              : "linear-gradient(135deg, #f8f9fa 0%, #e0e0e0 100%)",
          minHeight: "100vh",
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#7886C7" : "#ffffff",
        },
      },
    },
  },
});

const getTheme = (mode: "light" | "dark" = "dark") =>
  createTheme(getDesignTokens(mode));

export default getTheme;
