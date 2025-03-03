import React, { useState } from "react";
import { Container, Typography, Box, TextField, Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Navbar from "../components/Navbar";
import FraudActivityTable from "../components/FraudActivityTable";

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFlagChange = (event: SelectChangeEvent<string>) => {
    setSelectedFlag(event.target.value as string);
  };

  return (
    <Container sx={{ marginTop: 10, width: 'full' }}>
      <Navbar />
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2} marginTop={15}>
        <Typography variant="h4">⚠️ Fraud Alerts</Typography>
        <Box display="flex" gap={2}>
          {/* Search Bar */}
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 300 }}
          />

          {/* Flag Filter */}
          <Select
            value={selectedFlag}
            onChange={handleFlagChange}
            displayEmpty
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Flags</MenuItem>
            <MenuItem value="Critical">
              <Chip label="Critical" style={{ backgroundColor: "#c40f02", color: "white" }} />
            </MenuItem>
            <MenuItem value="High">
              <Chip label="High" style={{ backgroundColor: "#eb4034", color: "white" }} />
            </MenuItem>
            <MenuItem value="Medium">
              <Chip label="Medium" style={{ backgroundColor: "orange", color: "white" }} />
            </MenuItem>
            <MenuItem value="Low">
              <Chip label="Low" style={{ backgroundColor: "green", color: "white" }} />
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Fraud Activity Table */}
      <FraudActivityTable searchTerm={searchTerm} selectedFlag={selectedFlag} />
    </Container>
  );
};

export default Alerts;
