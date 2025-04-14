import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ReportButton from "../components/ReportButton";

const Settings: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4">⚙️ Settings</Typography>
      <Typography variant="body1">Manage system settings and user preferences.</Typography>
      <Box sx={{ mt: 4 }}>
        <ReportButton />
      </Box>
    </Container>
  );
};

export default Settings;
