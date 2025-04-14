import React, { useState } from "react";
import {
  Box, Typography, useTheme,
  Toolbar, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from "@mui/material";
import Navbar from "../components/Navbar";
import { styled } from "@mui/material/styles";
import ReportButton from "../components/ReportButton";
import TransactionGraph from "./TransactionGraph";
import Sidebar from "../components/Sidebar";
import MainContainer from "../components/MainContainer";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
          ? "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)"
          : "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
        boxShadow: `0 4px 20px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
        backdropFilter: "blur(4px)",
        transition: "background 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: "100%",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
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

// Sample data for charts and table
const fraudTypeData = [
  { name: 'Phishing', value: 35 },
  { name: 'Scam', value: 25 },
  { name: 'Hack', value: 20 },
  { name: 'Rug Pull', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const last7DaysData = [
  { name: 'Mon', frauds: 12 },
  { name: 'Tue', frauds: 19 },
  { name: 'Wed', frauds: 15 },
  { name: 'Thu', frauds: 8 },
  { name: 'Fri', frauds: 11 },
  { name: 'Sat', frauds: 6 },
  { name: 'Sun', frauds: 9 },
];

const latestThreats = [
  { id: 1, type: 'Phishing', address: '0x7a3...d4f2', severity: 'High', timestamp: '2024-03-15 14:30' },
  { id: 2, type: 'Scam', address: '0x9b2...e7a1', severity: 'Critical', timestamp: '2024-03-15 13:45' },
  { id: 3, type: 'Hack', address: '0x4c8...f9b3', severity: 'High', timestamp: '2024-03-15 12:20' },
  { id: 4, type: 'Rug Pull', address: '0x2e6...c5d8', severity: 'Medium', timestamp: '2024-03-15 11:15' },
  { id: 5, type: 'Phishing', address: '0x1f9...a7b4', severity: 'Low', timestamp: '2024-03-15 10:30' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return '#c40f02';
    case 'High': return '#eb4034';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

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
          <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <InfoCard
                title="Total Alerts"
                description="Over 1,000 fraud alerts detected and analyzed in the last 30 days."
                icon={<SecurityOutlinedIcon color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoCard
                title="Detection Rate"
                description="98% accuracy in identifying suspicious transactions and patterns."
                icon={<InsightsOutlinedIcon color="secondary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoCard
                title="Active Wallets"
                description="Monitoring 50,000+ wallet addresses for suspicious activity."
                icon={<AccountBalanceWalletIcon color="action" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoCard
                title="Risk Trends"
                description="15% decrease in high-risk transactions over the past month."
                icon={<TrendingUpIcon color="success" />}
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Pie Chart */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                background: isDark
                  ? "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)"
                  : "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: isDark ? "#fff" : "#111" }}>
                  Fraud Types Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fraudTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fraudTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: isDark ? "#0f2027" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        color: isDark ? "#fff" : "#111",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Line Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                background: isDark
                  ? "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)"
                  : "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: isDark ? "#fff" : "#111" }}>
                  Fraud Detection Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={last7DaysData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                    <XAxis 
                      dataKey="name" 
                      stroke={isDark ? "#fff" : "#111"}
                      tick={{ fill: isDark ? "#fff" : "#111" }}
                    />
                    <YAxis 
                      stroke={isDark ? "#fff" : "#111"}
                      tick={{ fill: isDark ? "#fff" : "#111" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: isDark ? "#0f2027" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                        color: isDark ? "#fff" : "#111",
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        color: isDark ? "#fff" : "#111",
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="frauds" 
                      stroke="#8884d8" 
                      name="Last 7 Days" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Latest Threats Table */}
          <Paper sx={{ 
            p: 3, 
            mb: 4,
            background: isDark
              ? "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)"
              : "linear-gradient(135deg, #e0f7fa 0%, #fce4ec 100%)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: isDark ? "#fff" : "#111" }}>
              Latest Threats
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>Type</TableCell>
                    <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>Address</TableCell>
                    <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>Severity</TableCell>
                    <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestThreats.map((threat) => (
                    <TableRow 
                      key={threat.id}
                      sx={{ 
                        '&:hover': {
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        }
                      }}
                    >
                      <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>{threat.type}</TableCell>
                      <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>{threat.address}</TableCell>
                      <TableCell>
                        <Chip
                          label={threat.severity}
                          sx={{
                            backgroundColor: getSeverityColor(threat.severity),
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: isDark ? "#fff" : "#111" }}>{threat.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {submittedAddress && <TransactionGraph address={submittedAddress} />}
          <ReportButton />
        </MainContainer>
      </Box>
    </Box>
  );
};

export default Home;