import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

interface FraudActivityTableProps {
  searchTerm: string;
  selectedFlag: string;
}

const FraudActivityTable: React.FC<FraudActivityTableProps> = ({ searchTerm, selectedFlag }) => {
  const [fraudActivities, setFraudActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFraudActivities = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/fraud-activities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch fraud activities. Status: ${response.status}`);
        }
  
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          id: item.ID, // Convert ID to lowercase id
          account: item.Account,
          type: item.Type,
          flag: item.Flag || "Unknown", // Handle missing flag
          failureCount: item.FailureCount || 0,
          createdAt: new Date(item.CreatedAt).toLocaleString(), // Format timestamp
        }));
  
        setFraudActivities(formattedData);
      } catch (err) {
        console.error("❌ Error fetching fraud activities:", err);
        setError("Error fetching fraud activities");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFraudActivities();
    const interval = setInterval(fetchFraudActivities, 10000);
  
    return () => clearInterval(interval);
  }, []);
  const getFlagColor = (flag: string) => {
    switch (flag) {
      case "Critical":
        return "#c40f02";
      case "High":
        return "#eb4034";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "#808080";
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "account", headerName: "Wallet ID", width: 200 },
    { field: "type", headerName: "Fraud Type", width: 200 },
    {
      field: "flag",
      headerName: "Flag",
      width: 120,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Chip
          label={params.row.flag}
          style={{ backgroundColor: getFlagColor(params.row.flag), color: "white" }}
        />
      ),
    },
    { field: "failureCount", headerName: "Failure Count", width: 150 },
    { field: "createdAt", headerName: "Detected At", width: 200 },
  ];

  // Apply search and flag filters
  const filteredActivities = fraudActivities.filter((activity) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(activity).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      );

    const matchesFlag = selectedFlag === "" || activity.flag === selectedFlag;

    return matchesSearch && matchesFlag;
  });

  return (
    <Box sx={{ marginTop: 5 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredActivities.length === 0 ? (
        <Typography>No fraud alerts found.</Typography>
      ) : (
        <DataGrid rows={filteredActivities} columns={columns} autoHeight pagination />
      )}
    </Box>
  );
};

export default FraudActivityTable;
