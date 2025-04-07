import React, { useState } from "react";
import {
  Container, Typography, Box, TextField, Chip,
  MenuItem, Select, SelectChangeEvent, useTheme, useMediaQuery
} from "@mui/material";
import Navbar from "../components/Navbar";
import FraudActivityTable from "../components/FraudActivityTable";

const Alerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFlagChange = (event: SelectChangeEvent<string>) => {
    setSelectedFlag(event.target.value as string);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
          : "linear-gradient(to right, #ffffff, #f0f4f8)",
        transition: "background 0.5s ease",
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />
      <Container sx={{ py: { xs: 15, sm: 15 } }}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent={isMobile ? "center" : "space-between"}
          mb={3}
          gap={isMobile ? 2 : 0}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            textAlign={isMobile ? "center" : "left"}
            width="100%"
          >
            ⚠️ Fraud Alerts
          </Typography>

          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
            gap={2}
            width={isMobile ? "100%" : "auto"}
          >
            {/* Search Bar */}
            <TextField
              label="Search"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: isMobile? "100%" : "350px",
                input: { color: theme.palette.text.primary },
                "& label": { color: theme.palette.text.secondary },
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
            />

            {/* Flag Filter */}
            <Select
              value={selectedFlag}
              onChange={handleFlagChange}
              displayEmpty
              fullWidth={isMobile}
              sx={{
                color: theme.palette.text.primary,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "#607d8b" : "#ccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="">All Flags</MenuItem>
              <MenuItem value="Critical">
                <Chip label="Critical" sx={{ backgroundColor: "#c40f02", color: "white", fontWeight: 500 }} />
              </MenuItem>
              <MenuItem value="High">
                <Chip label="High" sx={{ backgroundColor: "#eb4034", color: "white", fontWeight: 500 }} />
              </MenuItem>
              <MenuItem value="Medium">
                <Chip label="Medium" sx={{ backgroundColor: "orange", color: "white", fontWeight: 500 }} />
              </MenuItem>
              <MenuItem value="Low">
                <Chip label="Low" sx={{ backgroundColor: "green", color: "white", fontWeight: 500 }} />
              </MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Fraud Activity Table */}
        <FraudActivityTable searchTerm={searchTerm} selectedFlag={selectedFlag} />
      </Container>
    </Box>
  );
};

export default Alerts;
