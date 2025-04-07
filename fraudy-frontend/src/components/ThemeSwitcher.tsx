import { useContext } from "react";
import { ColorModeContext } from "../context/ColorModeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton, useTheme } from "@mui/material";

const ThemeSwitcher = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeSwitcher;
