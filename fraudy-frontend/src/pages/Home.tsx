import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, InputAdornment,
  IconButton, Menu, MenuItem, Checkbox, Paper, Fade, useTheme
} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled } from "@mui/material/styles";
import ReportButton from "../components/ReportButton";

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  animation: `slideFadeIn 2s ease-out`,
  fontWeight: 700,
  color: theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
  textAlign: "center",
  "@keyframes slideFadeIn": {
    "0%": {
      transform: "translateY(-30px)",
      opacity: 0,
    },
    "100%": {
      transform: "translateY(0)",
      opacity: 1,
    },
  },
}));


const Home: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCheckboxChange = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 10,
        background: isDark
          ? "linear-gradient(to right, #0f2027,#0f2027, #2c5364)"
          : "linear-gradient(to right, #ffffff, #f0f4f8)",
        color: theme.palette.text.primary,
        transition: "background 0.5s ease",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AnimatedTypography variant="h3">
          Fraud Detection System
        </AnimatedTypography>
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            color: theme.palette.text.secondary,
            textAlign: "center",
          }}
        >
          Secure your transactions with AI-powered fraud detection.
        </Typography>

        <Fade in timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              mt: 6,
              px: 2,
              py: 3,
              width: "100%",
              backdropFilter: "blur(10px)",
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
              borderRadius: 3,
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.1)",
              transition: "background 0.3s ease",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Wallet, Transaction ID, or Timestamp..."
              sx={{
                input: { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isDark ? "#607d8b" : "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClick}>
                      <SettingsIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          backgroundColor: isDark ? "#263238" : "#ffffff",
                          color: isDark ? "#e0e0e0" : "#000000",
                          borderRadius: 2,
                          boxShadow: 3,
                        },
                      }}
                    >
                      {["Wallet Only", "Transaction Only", "Include Timestamp"].map(
                        (label, index) => (
                          <MenuItem key={label}>
                            <Checkbox
                              checked={checked[index]}
                              onChange={() => handleCheckboxChange(index)}
                              sx={{
                                color: theme.palette.primary.main,
                              }}
                            />
                            {label}
                          </MenuItem>
                        )
                      )}
                    </Menu>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Fade>
      </Container>
      <ReportButton />
    </Box>
  );
};

export default Home;
