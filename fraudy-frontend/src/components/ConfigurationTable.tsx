import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const ConfigurationTable: React.FC = () => {
    const [configurations, setConfigurations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConfigurations = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setError("Unauthorized: Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/notification-configs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch configurations");
            }

            const data = await response.json();
            console.log("✅ Configurations API Response:", data);

            const formattedConfigs = data.map((config: {
                ID: any; ConfigName: any; NotificationType: any;
            }) => ({
                id: config.ID,
                configurationName: config.ConfigName,
                type: config.NotificationType,
            }));

            setConfigurations(formattedConfigs);
        } catch (error) {
            console.error("❌ Error fetching configurations:", error);
            setError("Failed to load configurations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigurations();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "configurationName", headerName: "Configuration Name", width: 300 },
        { field: "type", headerName: "Type", width: 200 },
        { field: "details", headerName: "Details", width: 100, renderCell: () => <VisibilityOutlinedIcon /> },
    ];

    return (
        <Box sx={{ marginTop: 5 }}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : configurations.length === 0 ? (
                <Typography>No configurations found.</Typography>
            ) : (
                <DataGrid
                    rows={configurations}
                    columns={columns}
                    pagination
                    autoHeight
                    getRowId={(row) => row.id}
                />
            )}
        </Box>
    );
};

export default ConfigurationTable;
