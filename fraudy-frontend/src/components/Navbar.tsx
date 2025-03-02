import React, { useState } from "react";
import { AppBar, Toolbar, Box, Button, Menu, MenuItem, Link } from "@mui/material";
import logo from "../assets/img/logo.png";
import LogoutIcon from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import DoorbellIcon from '@mui/icons-material/Doorbell';
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        borderRadius: "15px", // Rounded corners
        margin: "10px", // Space from edges
        maxWidth: "90%", // Navbar width
        left: "50%",
        transform: "translateX(-50%)", // Center alignment
        boxShadow: "0px 2px 4px -1px rgba(19, 113, 189, 0.2), 0px 4px 5px 0px rgba(19, 113, 189, 0.2), 0px 1px 10px 0px rgba(19, 113, 189, 0.2)", // Shadow effect
        border: "1px solid rgba(29, 110, 202, 0.3)", // Light border
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-1px",
          left: "-1px",
          right: "-1px",
          bottom: "-1px",
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))", // Gradient effect
          zIndex: -1,
          borderRadius: "15px",
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: "auto" ,width: "150px", marginLeft: "-12px" }} />
        </Box>
        <Button href="/" color="inherit" startIcon={<HomeIcon />}>Home</Button>
        <Button color="inherit" onClick={handleClick} startIcon={<DoorbellIcon />}>Alerts</Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={ Link } href="/alerts" onClick={handleClose}>History</MenuItem>
          <MenuItem component={ Link } href="/create-alert" onClick={handleClose}>Create Alert</MenuItem>
        </Menu>
        <Button href="/configuration" color="inherit" startIcon={<Settings />}>Configuration</Button>
        <Button href="/profile" color="inherit" startIcon={<Person />}>Profile</Button>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

