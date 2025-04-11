import React from "react";
import {
  AppBar, Box, IconButton, InputAdornment,
  TextField, Toolbar, useMediaQuery, useTheme
} from "@mui/material";
import { Search as SearchIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
interface NavbarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  onSettingsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSettingsClick,
  sidebarOpen
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(); // mevcut handler
      if (searchQuery.trim()) {
        navigate(`/wallet/${searchQuery.trim()}`);
      }
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? 240 : 72}px)`,
        ml: isMobile ? 0 : `${sidebarOpen ? 240 : 72}px`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: theme.zIndex.drawer,
        background: isDark
          ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
          : "linear-gradient(to right, #ffffff, #f0f4f8)",
        backdropFilter: "blur(12px)",
        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(0,0,0,0.1)",
        padding: isMobile ? "0 16px" : "0 24px",
      }}
    >
      <Toolbar>
        <Box sx={{ width: isMobile ? '100%' : '90%', ml: isMobile ? 6 : 0, flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search Wallet, Transaction ID, or Timestamp..."
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onSettingsClick}>
                    <SettingsIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;