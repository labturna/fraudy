import React from "react";
import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";

interface MainContainerProps {
  sidebarOpen: boolean;
  children: React.ReactNode;
}

const drawerWidth = 240;
const collapsedWidth = 72;

const MainContainer: React.FC<MainContainerProps> = ({ sidebarOpen, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="main"
      sx={{
        background: isDark
            ? "linear-gradient(to right, #0f2027,#0f2027, #2c5364)"
            : "linear-gradient(to right, #ffffff, #f0f4f8)",
        flexGrow: 1,
        p: 3,
        minHeight: "100vh",
        ml: isMobile ? 0 : `${sidebarOpen ? drawerWidth : collapsedWidth}px`,
        width: isMobile ? "100%" : `calc(100% - ${sidebarOpen ? drawerWidth : collapsedWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {/* Ensures space for the fixed navbar */}
      <Toolbar />
      {children}
    </Box>
  );
};

export default MainContainer;
