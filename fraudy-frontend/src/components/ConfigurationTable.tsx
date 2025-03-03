import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    Modal,
    Fade,
    Container,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

interface ConfigurationTableProps {
    refreshConfig: boolean;
}

const ConfigurationTable: React.FC<ConfigurationTableProps> = ({ refreshConfig }) => {
    const [configurations, setConfigurations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedConfig, setSelectedConfig] = useState<any | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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

            const formattedConfigs = data.map((config: any) => ({
                id: config.ID,
                configurationName: config.ConfigName,
                type: config.NotificationType,
                slackWebhook: config.SlackWebhook || "N/A",
                emailSender: config.EmailSender || "N/A",
                smtpServer: config.SMTPServer || "N/A",
                smtpPort: config.SMTPPort || "N/A",
                recipientEmails: config.RecipientEmails || "N/A",
                telegramChatId: config.TelegramChatID || "N/A",
                discordChannel: config.DiscordChannel || "N/A",
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
    }, [refreshConfig]);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setSnackbarMessage("Unauthorized: Please log in.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/notification-configs/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete configuration");
            }

            setSnackbarMessage("Configuration deleted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            fetchConfigurations(); // Refresh after deletion
        } catch (error: any) {
            console.error("❌ Error deleting configuration:", error);
            setSnackbarMessage(error.message || "An error occurred.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOpenDetails = (config: any) => {
        setSelectedConfig(config);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedConfig(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "configurationName", headerName: "Configuration Name", width: 250 },
        { field: "type", headerName: "Type", width: 150 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <Box display="flex" gap={2} margin={2}>
                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<VisibilityOutlinedIcon />}
                        onClick={() => handleOpenDetails(params.row)}
                        sx={{ color: "white"}}
                    >
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(params.row.id)}
                    >
                    </Button>
                </Box>
            ),
        },
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

            {/* Details Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        borderRadius: 4,
                        width: "50%",
                        backgroundColor: "transparent",
                        boxShadow: 24,
                        p: 4,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <Container maxWidth="sm">
                            <Typography variant="h5" gutterBottom>
                                Configuration Details
                            </Typography>
                            {selectedConfig && (
                                <Paper elevation={3} sx={{ padding: 2 }}>
                                    <Typography><strong>ID:</strong> {selectedConfig.id}</Typography>
                                    <Typography><strong>Name:</strong> {selectedConfig.configurationName}</Typography>
                                    <Typography><strong>Type:</strong> {selectedConfig.type}</Typography>

                                    {selectedConfig.type === "slack" && (
                                        <Typography><strong>Slack Webhook:</strong> {selectedConfig.slackWebhook}</Typography>
                                    )}
                                    {selectedConfig.type === "email" && (
                                        <>
                                            <Typography><strong>Email Sender:</strong> {selectedConfig.emailSender}</Typography>
                                            <Typography><strong>SMTP Server:</strong> {selectedConfig.smtpServer}</Typography>
                                            <Typography><strong>SMTP Port:</strong> {selectedConfig.smtpPort}</Typography>
                                            <Typography><strong>Recipients:</strong> {selectedConfig.recipientEmails}</Typography>
                                        </>
                                    )}
                                    {selectedConfig.type === "telegram" && (
                                        <Typography><strong>Telegram Chat ID:</strong> {selectedConfig.telegramChatId}</Typography>
                                    )}
                                    {selectedConfig.type === "discord" && (
                                        <Typography><strong>Discord Channel:</strong> {selectedConfig.discordChannel}</Typography>
                                    )}
                                </Paper>
                            )}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ConfigurationTable;
