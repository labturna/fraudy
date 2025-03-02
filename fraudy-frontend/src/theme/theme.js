import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Aldrich, sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#2D336B", // Varsayılan tek renk arka plan
      paper: "#A9B5DF",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg,rgb(45, 49, 107) 0%,rgb(120, 128, 199) 100%)",
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
          backgroundColor: "#7886C7",
        },
      },
    },
  },
});

export default theme;
