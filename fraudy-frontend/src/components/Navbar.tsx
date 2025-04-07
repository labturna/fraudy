import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Button, Menu, MenuItem, Link,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, useTheme, useMediaQuery, Typography,
} from "@mui/material";

import {
  Logout, Person, Settings, Home, Doorbell,
  ExpandMore, Menu as MenuIcon, Close,
  HistoryOutlined,
  AddAlarm,
  LinkOffRounded
} from "@mui/icons-material";

import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const navItems = [
    { text: "Home", icon: <Home />, href: "/" },
    {
      text: "Alerts", icon: <Doorbell />, submenu: [
        { text: "History", icon: <HistoryOutlined />, href: "/alerts" },
        { text: "Create Alert", icon: <AddAlarm />, href: "/create-alert" }
      ]
    },
    { text: "Config", icon: <Settings />, href: "/configuration" },
    { text: "Reported Addresses", icon: <LinkOffRounded />, href: "/reported-addresses" },
    { text: "Profile", icon: <Person />, href: "/profile" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(15, 32, 39, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "12px",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "95%",
          px: 2,
          border: theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
              : "0 8px 32px 0 rgba( 31, 38, 135, 0.1 )",
          color: theme.palette.text.primary,
        }}
      >


        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ width: "140px", height: "auto" }} />
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button href="/" sx={{ color: "inherit" }} startIcon={<Home />}>Home</Button>
              <Button onClick={handleClick} sx={{ color: "inherit" }} startIcon={<Doorbell />} endIcon={<ExpandMore />}>Alerts</Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: 4,
                  },
                }}
              >
                <MenuItem component={Link} href="/alerts" onClick={handleClose}>
                  <ListItemIcon>
                    <HistoryOutlined fontSize="small" />
                  </ListItemIcon>
                  History
                </MenuItem>

                <MenuItem component={Link} href="/create-alert" onClick={handleClose}>
                  <ListItemIcon>
                    <AddAlarm fontSize="small" />
                  </ListItemIcon>
                  Create Alert
                </MenuItem>
              </Menu>
              <Button href="/configuration" sx={{ color: "inherit" }} startIcon={<Settings />}>Config</Button>
              <Button href="/profile" sx={{ color: "inherit" }} startIcon={<Person />}>Profile</Button>
              <Button color="inherit" startIcon={<LinkOffRounded />} href="/reported-addresses">Reported Addresses</Button>
              <ThemeSwitcher />
              <Button
                onClick={handleLogout}
                sx={{
                  color: theme.palette.error.main,
                  border: `1px solid ${theme.palette.error.main}`,
                  borderRadius: 2,
                  px: 2,
                  ml: 1,
                  "&:hover": { backgroundColor: `${theme.palette.error.main}10` },
                }}
                startIcon={<Logout />}
              >
                Logout
              </Button>
            </Box>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ height: '100%', width: 250, p: 2, background: theme.palette.mode === "dark" ? "#0f2027" : "#ffffffee" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) =>
              item.submenu ? (
                <React.Fragment key={item.text}>
                  {item.submenu.map((sub) => (
                    <ListItem key={sub.text} disablePadding>
                      <ListItemButton component="a" href={sub.href}>
                        <ListItemIcon>{sub.icon}</ListItemIcon>
                        <ListItemText primary={sub.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              ) : (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component="a" href={item.href}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ThemeSwitcher />
                </ListItemIcon>
                <ListItemText primary="Toggle Theme" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
