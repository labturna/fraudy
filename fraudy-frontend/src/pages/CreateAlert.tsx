import React, { useState } from "react";
import {
  Box, Container, Typography, TextField, Select,
  MenuItem, Button, Modal, Fade, FormControl, InputLabel,
  Switch, useTheme, useMediaQuery
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { de } from 'date-fns/locale/de';

import Navbar from "../components/Navbar";
import AlertsTable from "../components/AlertsTable";
import NotificationDropdown from "../components/NotificationDropdown";
import { toast } from "react-toastify";
const CreateAlert: React.FC = () => {
  const [alertName, setAlertName] = useState("");
  const [walletId, setWalletId] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [transactionThreshold, setTransactionThreshold] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        toast.error("Unauthorized: Please log in.");
      return;
    }
    const payload = {
      AlertName: alertName,
      RuleType: ruleType,
      NotificationPreferences: JSON.stringify(selectedNotifications),
      WalletID: walletId,
      TransactionThreshold: transactionThreshold ? parseFloat(transactionThreshold) : 0,
      TimeFrame: timeFrame ? parseInt(timeFrame) : 0,
      TransactionStatus: transactionStatus,
    };

    try {
      const response = await fetch("http://localhost:8080/api/create-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create alert.");
      toast.success("Alert created successfully!");
      setAlertName("");
      setWalletId("");
      setRuleType("");
      setTransactionThreshold("");
      setTimeFrame("");
      setTransactionStatus(true);
      setSelectedNotifications([]);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create alert.");
    }
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Box
        sx={{
          minHeight: "100vh",
          background: isDark
            ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
            : "linear-gradient(to right, #ffffff, #f0f4f8)",
          transition: "background 0.3s ease",
          color: theme.palette.text.primary,
        }}
      >
        <Navbar />

        <Container sx={{ pt: 15, pb: 4 }}>
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
            <Typography variant="h4" fontWeight={600}>Your Alerts</Typography>
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Create Alert
            </Button>
          </Box>

          <AlertsTable />
        </Container>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? "90%" : "60%",
                maxHeight: "90vh",
                overflowY: "auto",
                background: theme.palette.mode === "dark"
                                    ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
                                    : "linear-gradient(to right, #ffffff, #f0f4f8)",
                                color: theme.palette.text.primary,
                borderRadius: 4,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h5" gutterBottom>Create Alert</Typography>

              <TextField
                label="Alert Name"
                fullWidth
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Wallet ID"
                fullWidth
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="rule-label">Rule</InputLabel>
                <Select
                  labelId="rule-label"
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  label="Rule"
                >
                  <MenuItem value="invalidSignatures">Invalid Signatures</MenuItem>
                  <MenuItem value="replayAttacks">Replay Attacks</MenuItem>
                  <MenuItem value="doubleSpends">Double Spends</MenuItem>
                  <MenuItem value="highFailureRate">High Failure Rate</MenuItem>
                  <MenuItem value="anomalousVolume">Anomalous Volume</MenuItem>
                  <MenuItem value="suspiciousNewAccounts">Suspicious New Accounts</MenuItem>
                  <MenuItem value="customRule">Custom Rule</MenuItem>
                </Select>
              </FormControl>

              {ruleType === "customRule" && (
                <>
                  <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
                    <TextField
                      label="Transaction Threshold"
                      type="number"
                      fullWidth
                      value={transactionThreshold}
                      onChange={(e) => setTransactionThreshold(e.target.value)}
                    />
                    <TextField
                      label="Time Frame (minutes)"
                      type="number"
                      fullWidth
                      value={timeFrame}
                      onChange={(e) => setTimeFrame(e.target.value)}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography>Transaction Status:</Typography>
                    <Switch
                      checked={transactionStatus}
                      onChange={(e) => setTransactionStatus(e.target.checked)}
                      color="primary"
                    />
                    <Typography>{transactionStatus ? "True" : "False"}</Typography>
                  </Box>
                </>
              )}

              <Box mb={2}>
                <NotificationDropdown
                  selectedNotifications={selectedNotifications}
                  onChange={setSelectedNotifications}
                />
              </Box>

              <Button variant="contained" onClick={handleSubmit}>
                Create Alert
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAlert;
