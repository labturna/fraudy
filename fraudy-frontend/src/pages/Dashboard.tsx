import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ReportButton from "../components/ReportButton";

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4">📊 Dashboard</Typography>
      <Typography variant="body1">Welcome to the Fraud Detection System!</Typography>
      <Box sx={{ mt: 4 }}>
        <ReportButton />
      </Box>
    </Container>
  );
};

export default Dashboard;
