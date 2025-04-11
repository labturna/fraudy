import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MainContainer from "../components/MainContainer";
import TransactionGraph from "./TransactionGraph";

const WalletDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar onToggle={(open) => setSidebarOpen(open)} />
      <MainContainer sidebarOpen={sidebarOpen}>
        <Navbar
          searchQuery=""
          onSearchChange={() => {}}
          onSearchSubmit={() => {}}
          onSettingsClick={() => {}}
          sidebarOpen={sidebarOpen}
        />
        <Box sx={{ mx: isMobile ? 0 : 3, mt: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Transactions for: <code>{address}</code>
          </Typography>
          <TransactionGraph address={address || ""} />
        </Box>
      </MainContainer>
    </Box>
  );
};

export default WalletDetails;
