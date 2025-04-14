import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Switch,
  useMediaQuery
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainContainer from "../components/MainContainer";
import ReportButton from "../components/ReportButton";

const InfoCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        color: isDark ? "#fff" : "#111",
        background: isDark
          ? "linear-gradient(135deg, #1c1c3a 0%, #2b5876 100%)"
          : "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
        boxShadow: `0 4px 20px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
        backdropFilter: "blur(4px)",
        transition: "background 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="h6" fontWeight={600}>{title}</Typography>
      </Box>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {description}
      </Typography>
    </Paper>
  );
};

const Profile: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [twoFA, setTwoFA] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText("d8a3c8d1-ff33-4c5f-9012-e2db28fe89f1");
  };

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

        <Box
          sx={{
            mt: 3,
            mb: 6,
            mx: isMobile ? 0 : 3,
          }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: isDark
                ? "linear-gradient(to right,rgb(24, 37, 43),rgb(17, 31, 37),rgb(15, 28, 34))"
                : "linear-gradient(to right, #ffffff, #f0f4f8)",
            }}
          >
            {/* Account Info */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
              👤 Account Overview
            </Typography>
            <Typography>Email: <strong>user@example.com</strong></Typography>
            <Typography>Registered: Jan 12, 2024</Typography>
            <Typography>Last Login: Apr 7, 2025</Typography>

            <Divider sx={{ my: 3 }} />

            {/* Info Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <InfoCard
                  title="Alerts Created"
                  description="You've created 12 alerts to monitor suspicious wallets and activities."
                  icon={<NotificationsActiveOutlinedIcon color="primary" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoCard
                  title="Detection Accuracy"
                  description="Your reported alerts have a 92% match rate with confirmed fraud events."
                  icon={<SecurityOutlinedIcon color="secondary" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoCard
                  title="Activity Insights"
                  description="3 of your alerts have flagged high-volume, high-risk transactions."
                  icon={<InsightsOutlinedIcon color="action" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoCard
                  title="Most Alerted Wallet"
                  description="0xF5a...dB12 has triggered 4 different alerts."
                  icon={<AccountBalanceWalletIcon color="warning" />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InfoCard
                  title="Report Stats"
                  description="You've reported 5 addresses in the last month. 2 of them have been accepted. 3 of them have been declined."
                  icon={<NotificationsActiveOutlinedIcon color="primary" />}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Security Settings */}
            <Typography variant="h6" gutterBottom>🔐 Security</Typography>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>2FA</Typography>
                <Typography variant="body2">Two-factor authentication is {twoFA ? "enabled" : "disabled"}.</Typography>
              </Box>
              <Switch checked={twoFA} onChange={() => setTwoFA(!twoFA)} color="success" />
            </Box>

            <Box mt={3} mb={3}>
              <Typography variant="subtitle1" fontWeight={600}>Change Password</Typography>
              <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mt={1}>
                <TextField label="Old Password" type="password" fullWidth />
                <TextField label="New Password" type="password" fullWidth />
                <Button variant="contained" color="primary">Update</Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>API Token</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <TextField
                  fullWidth
                  disabled
                  value="d8a3c8d1-ff33-4c5f-9012-e2db28fe89f1"
                  sx={{ input: { fontFamily: "monospace" } }}
                />
                <Tooltip title="Copy Token">
                  <IconButton onClick={handleCopy}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
          <Box sx={{ mt: 4 }}>
            <ReportButton />
          </Box>
        </Box>
      </MainContainer>
    </Box>
  );
};

export default Profile;
