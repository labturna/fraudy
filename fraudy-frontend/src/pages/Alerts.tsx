import React, { useState } from "react";
import { Container, Typography, Box, TextField, Chip } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import Navbar from "../components/Navbar";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const Alerts: React.FC = () => {
  const dummyData = [
    {
      "id": 1,
      "activity": "Suspicious login",
      "summary": "Unusual login pattern detected",
      "flag": "High",
      "rule": "Suspicious login pattern",
      "timestamp": "2022-01-01 12:34:56",
      "details": "User logged in from an unusual IP address"
    },
    {
      "id": 2,
      "activity": "Phishing attempt",
      "summary": "User interacted with a known phishing site",
      "flag": "Critical",
      "rule": "Blacklisted domain access",
      "timestamp": "2022-01-02 14:21:33",
      "details": "User connected their wallet to a flagged phishing site"
    },
    {
      "id": 3,
      "activity": "Smart contract exploit",
      "summary": "Unusual contract interaction detected",
      "flag": "High",
      "rule": "Contract vulnerability pattern",
      "timestamp": "2022-01-03 09:45:10",
      "details": "User executed a function linked to a past exploit"
    },
    {
      "id": 4,
      "activity": "Flash loan attack",
      "summary": "Rapid borrowing and liquidation observed",
      "flag": "Critical",
      "rule": "Abnormal lending activity",
      "timestamp": "2022-01-04 11:12:50",
      "details": "User initiated multiple flash loans within seconds"
    },
    {
      "id": 5,
      "activity": "Sybil attack detected",
      "summary": "Multiple wallet addresses linked to one entity",
      "flag": "Medium",
      "rule": "Sybil pattern detection",
      "timestamp": "2022-01-05 16:30:15",
      "details": "Several new wallets interacting in a coordinated manner"
    },
    {
      "id": 6,
      "activity": "Unauthorized token minting",
      "summary": "Excessive token minting from an unknown contract",
      "flag": "Critical",
      "rule": "Token minting anomaly",
      "timestamp": "2022-01-06 20:17:45",
      "details": "A contract minted tokens beyond expected limits"
    },
    {
      "id": 7,
      "activity": "Rug pull alert",
      "summary": "Liquidity drained from a DeFi pool",
      "flag": "High",
      "rule": "Liquidity removal detection",
      "timestamp": "2022-01-07 22:05:37",
      "details": "Large fund withdrawals detected in a short period"
    },
    {
      "id": 8,
      "activity": "Wash trading attempt",
      "summary": "Repeated trades between related wallets",
      "flag": "Medium",
      "rule": "Unusual trading volume",
      "timestamp": "2022-01-08 07:50:22",
      "details": "Multiple buy/sell orders executed between linked accounts"
    },
    {
      "id": 9,
      "activity": "NFT price manipulation",
      "summary": "Artificially inflated NFT transactions",
      "flag": "High",
      "rule": "Price spike anomaly",
      "timestamp": "2022-01-09 15:40:29",
      "details": "NFT sold multiple times at unrealistic price points"
    },
    {
      "id": 10,
      "activity": "Compromised private key",
      "summary": "Tokens transferred to a known scam address",
      "flag": "Critical",
      "rule": "Hacked wallet pattern",
      "timestamp": "2022-01-10 18:55:44",
      "details": "Large unauthorized transfer detected"
    }
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dummyData);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "activity", headerName: "Activity", width: 200 },
    { field: "summary", headerName: "Summary", width: 300 },
    {
      field: "flag",
      headerName: "Flag",
      width: 100,
      renderCell: (params: GridRenderCellParams<any>) => {
        const flag = params.row.flag;
        let color;
        switch (flag) {
          case 'High':
            color = '#eb4034';
            break;
          case 'Medium':
            color = 'orange';
            break;
          case 'Low':
            color = 'green';
            break;
          default:
            color = '#c40f02';
        }
        return <Chip label={flag} style={{ backgroundColor: color, color: 'white' }} />;
      },

    },
    { field: "rule", headerName: "Rule", width: 200 },
    { field: "timestamp", headerName: "Timestamp", width: 200 },
    {
      field: "details",
      headerName: "Details",
      width: 70,
      renderCell: () => <VisibilityOutlinedIcon />,
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const filtered = dummyData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery)
      )
    );
    setSearchTerm(searchQuery);
    setFilteredData(filtered);
  };
  return (
    <Container sx={{ marginTop: 20, width: 'full' }}>
      <Navbar />
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
        <Typography variant="h4">⚠️ Alerts</Typography>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </Box>
      <DataGrid
        rows={filteredData}
        columns={columns}
        pagination
        style={{ width: '100%' }}
      />
    </Container>
  );
};

export default Alerts;

