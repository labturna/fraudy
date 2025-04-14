import React, { useState } from "react";
import {
  Box, Divider, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme,
  useMediaQuery, CssBaseline, MenuItem, Link, Menu, Typography
} from "@mui/material";
import {
  ChevronLeft, ChevronRight, Home, Doorbell,
  Settings, LinkOffRounded, Person, Logout, Menu as MenuIcon,
  ExpandMore
} from "@mui/icons-material";
import ThemeSwitcher from "./ThemeSwitcher";
import { useNavigate } from "react-router-dom";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import AddAlarm from "@mui/icons-material/AddAlarm";
import logo from "../assets/img/logo.png";

const drawerWidth = 240;
const collapsedWidth = 64;
const mobileDrawerWidth = "100%";

interface SidebarProps {
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      const newOpen = !desktopOpen;
      setDesktopOpen(newOpen);
      onToggle(newOpen);
    }
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

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme.palette.mode === "dark"
          ? "linear-gradient(to left, #0f2027, #0f2027,rgb(13, 40, 51))"
          : "linear-gradient(to left, #ffffff, #f0f4f8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Toolbar 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '64px',
          px: 2,
          gap: 1
        }}
      >
        {desktopOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="Logo" style={{ width: "128px", height: "32px" }} />
          </Box>
        )}
        {!isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            {desktopOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) =>
          item.submenu ? (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component="button"
                  onClick={handleClick}
                  sx={{
                    width: '100%',
                    minHeight: 48,
                    justifyContent: desktopOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: desktopOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.primary
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {desktopOpen && (
                    <>
                      <ListItemText primary={item.text} />
                      <ExpandMore sx={{ fontSize: 16 }} />
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: 4,
                    ml: isMobile ? 0 : (desktopOpen ? `${drawerWidth - collapsedWidth}px` : '64px'),
                    mt: isMobile ? '8px' : '-40px',
                    minWidth: isMobile ? '100%' : '200px'
                  },
                }}
              >
                {item.submenu.map((sub) => (
                  <MenuItem
                    key={sub.text}
                    component={Link}
                    href={sub.href}
                    onClick={handleClose}
                    sx={{
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {sub.icon}
                    </ListItemIcon>
                    {sub.text}
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          ) : (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component="a"
                href={item.href}
                sx={{
                  minHeight: 48,
                  justifyContent: desktopOpen ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: desktopOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: theme.palette.text.primary
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {desktopOpen && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>

      <Divider />

      <Box sx={{ p: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: desktopOpen ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: desktopOpen ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <ThemeSwitcher />
            </ListItemIcon>
            {desktopOpen && <ListItemText primary="Theme" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: desktopOpen ? 'initial' : 'center',
              px: 2.5,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: `${theme.palette.error.main}10`,
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: desktopOpen ? 3 : 'auto',
                justifyContent: 'center',
                color: theme.palette.error.main,
              }}
            >
              <Logout />
            </ListItemIcon>
            {desktopOpen && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: mobileDrawerWidth,
            boxSizing: 'border-box',
            background: theme.palette.mode === "dark"
              ? "rgba(15, 32, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: desktopOpen ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            position: 'fixed',
            height: '100vh',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            background: theme.palette.mode === "dark"
              ? "rgba(15, 32, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            zIndex: theme.zIndex.drawer - 1,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile hamburger menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            position: 'fixed',
            left: 16,
            top: 16,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(15, 32, 39, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            boxShadow: 2,
            display: { md: 'none' },
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(15, 32, 39, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
            },
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'}`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {mobileOpen ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;