import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography, Chip, Stack } from "@mui/material";

const AlertsTable: React.FC = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch alerts from API
    const fetchAlerts = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            setError("Unauthorized: Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/alerts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch alerts");
            }

            const data = await response.json();
            console.log("✅ Alerts API Response:", data); // Debug API data

            // Ensure data formatting matches DataGrid column keys
            const formattedAlerts = data.map((alert: {
                ID: any;
                AlertName: any;
                WalletID: any;
                RuleType: any;
                NotificationPreferences: string;
                TransactionThreshold?: number;
                TimeFrame?: number;
                TransactionStatus?: any;
            }) => ({
                id: alert.ID,  
                alertName: alert.AlertName,
                walletId: alert.WalletID || "N/A",
                ruleType: alert.RuleType,
                notifications: alert.NotificationPreferences ? JSON.parse(alert.NotificationPreferences) : [], // Convert string to array
                threshold: alert.TransactionThreshold || 0,
                timeFrame: alert.TimeFrame || 0,
                transactionStatus: alert.TransactionStatus,
            }));

            setAlerts(formattedAlerts);
        } catch (error) {
            console.error("❌ Error fetching alerts:", error);
            setError("Failed to load alerts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "alertName", headerName: "Alert Name", width: 200 },
        { field: "walletId", headerName: "Wallet ID", width: 200 },
        { field: "ruleType", headerName: "Rule Type", width: 200 },
        {
            field: "notifications",
            headerName: "Notifications",
            width: 250,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ marginTop: 1}}>
                    {params.value.map((notification: string, index: number) => (
                        <Chip 
                        key={index} 
                        label={notification} 
                        sx={{
                          background: 'linear-gradient(45deg,rgb(254, 107, 254) 30%,rgb(83, 192, 255) 90%)',
                          color: 'white',
                        }} 
                      />
                    ))}
                </Stack>
            ),
        },
        { field: "threshold", headerName: "Threshold", width: 100 },
        { field: "timeFrame", headerName: "Time Frame", width: 100 },
        { field: "transactionStatus", headerName: "Transaction Status", width: 150 },
    ];

    return (
        <Box sx={{ marginTop: 5 }}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : alerts.length === 0 ? (
                <Typography>No alerts found.</Typography>
            ) : (
                <DataGrid
                    rows={alerts}
                    columns={columns}
                    pagination
                    autoHeight
                    getRowId={(row) => row.id} // Ensure correct row ID
                />
            )}
        </Box>
    );
};

export default AlertsTable;
