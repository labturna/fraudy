import React, { useState } from "react";
import { Box, Container, Typography, TextField, InputAdornment, IconButton, Menu, MenuItem, Checkbox } from "@mui/material";
import Navbar from "../components/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled } from "@mui/material/styles";

const AnimatedTypography = styled(Typography)({
  animation: `$fadeInOut 6s infinite`,
  "@keyframes fadeInOut": {
    "0%": { opacity: 0 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
});
const Home: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Navbar />
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AnimatedTypography variant="h2" sx={{ color: "white" }}>
          Fraud Detection System
        </AnimatedTypography>
        <Typography variant="h6" sx={{ color: "#b0bec5" }}>
          Secure your transactions with AI-powered fraud detection.
        </Typography>
        <Box sx={{ width: "100%", maxWidth: 800, mt: 5 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Wallet, Transaction ID, or Timestamp"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <SettingsIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem>
                      <Checkbox sx={{ color: "red" }} checked={checked[0]} onChange={() => handleCheckboxChange(0)} />
                      Option 1
                    </MenuItem>
                    <MenuItem>
                      <Checkbox sx={{ color: "red" }} checked={checked[1]} onChange={() => handleCheckboxChange(1)} />
                      Option 2
                    </MenuItem>
                    <MenuItem>
                      <Checkbox sx={{ color: "red" }} checked={checked[2]} onChange={() => handleCheckboxChange(2)} />
                      Option 3
                    </MenuItem>
                  </Menu>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

