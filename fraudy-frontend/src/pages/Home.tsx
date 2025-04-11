import React, { useState } from "react";
import {
  Box, Typography, useTheme,
  Toolbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import { styled } from "@mui/material/styles";
import ReportButton from "../components/ReportButton";
import TransactionGraph from "./TransactionGraph";
import Sidebar from "../components/Sidebar";
import MainContainer from "../components/MainContainer";
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
  const [, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleSearchSubmit = () => {
    setSubmittedAddress(searchQuery.trim());
    setSearchQuery("");
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          background: isDark
            ? "linear-gradient(to right, #0f2027,#0f2027, #2c5364)"
            : "linear-gradient(to right, #ffffff, #f0f4f8)",
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Sidebar onToggle={(open) => setSidebarOpen(open)} />

        <Navbar
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          onSettingsClick={handleClick}
          sidebarOpen={sidebarOpen}
        />
        <MainContainer sidebarOpen={sidebarOpen}>
          <Toolbar />
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
          {submittedAddress && <TransactionGraph address={submittedAddress} />}
          <ReportButton />
        </MainContainer>
      </Box>
    </Box>
  );
};

export default Home;