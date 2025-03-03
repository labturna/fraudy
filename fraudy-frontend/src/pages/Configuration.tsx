import React, { useState } from "react";
import { SelectChangeEvent, Snackbar, Alert } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
    Modal,
    Fade,
    Box,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Chip,
    Paper
} from "@mui/material";
import Navbar from "../components/Navbar";
import ConfigurationTable from "../components/ConfigurationTable";

const Configuration: React.FC = () => {
    const [notificationPreference, setNotificationPreference] = useState("");
    const [configName, setConfigName] = useState("");
    const [senderPassword, setSenderPassword] = useState("");
    const [smtpServer, setSmtpServer] = useState("");
    const [smtpPort, setSmtpPort] = useState("");
    const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [slackChannel, setSlackChannel] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [telegramChatId, setTelegramChatId] = useState("");
    const [discordChannel, setDiscordChannel] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [refreshConfig, setRefreshConfig] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleConfigNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfigName(event.target.value);
    };

    const handleNotificationPreferenceChange = (event: SelectChangeEvent<string>) => {
        setNotificationPreference(event.target.value as string);
    };

    const handleSenderPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSenderPassword(event.target.value);
    };

    const handleSmtpServerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSmtpServer(event.target.value);
    };

    const handleSmtpPortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSmtpPort(event.target.value);
    };

    const handleRecipientEmailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            event.preventDefault();

            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(inputValue.trim())) {
                return;
            }

            setRecipientEmails([...recipientEmails, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleDelete = (emailToDelete: string) => {
        setRecipientEmails(recipientEmails.filter((email) => email !== emailToDelete));
    };

    const handleSlackChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSlackChannel(event.target.value);
    };

    const handleEmailAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailAddress(event.target.value);
    };

    const handleTelegramChatIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelegramChatId(event.target.value);
    };

    const handleDiscordChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscordChannel(event.target.value);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setSnackbarMessage("Unauthorized: Please log in.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const payload = {
            config_name: configName,
            notification_type: notificationPreference,
            slack_webhook: slackChannel || null,
            email_sender: emailAddress || null,
            email_password: senderPassword || null,
            smtp_server: smtpServer || null,
            smtp_port: smtpPort || null,
            recipient_emails: recipientEmails,
            telegram_chat_id: telegramChatId || null,
            discord_channel: discordChannel || null,
        };

        try {
            const response = await fetch("http://localhost:8080/api/notification-configs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to save configuration.");
            }

            setSnackbarMessage("Configuration saved successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // ✅ Refresh configuration table after saving
            setRefreshConfig((prev) => !prev);

            // Clear form fields
            setConfigName("");
            setNotificationPreference("");
            setSlackChannel("");
            setEmailAddress("");
            setSenderPassword("");
            setSmtpServer("");
            setSmtpPort("");
            setRecipientEmails([]);
            setTelegramChatId("");
            setDiscordChannel("");

            handleCloseModal(); 
        } catch (error: any) {
            console.error("❌ Error saving configuration:", error);
            setSnackbarMessage(error.message || "An error occurred. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Navbar />
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "52%" }}>
                <Typography variant="h4">Configurations</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Create Configuration
                </Button>
            </Box>
            <ConfigurationTable refreshConfig={refreshConfig} /> 

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="alert-modal-title"
                aria-describedby="alert-modal-description"
            >
                <Fade in={openModal}>
                    <Box sx={{
                        position: 'absolute',
                        borderRadius: 6,
                        width: "70%",
                        backgroundColor: "#353e96",
                        border: '2px solid #fff',
                        boxShadow: 12,
                        p: 4,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>

                        <Container maxWidth="md">
                            <Typography variant="h4" gutterBottom>
                                Create Configuration
                            </Typography>
                            <TextField
                                label="Configuration Name"
                                value={configName}
                                onChange={handleConfigNameChange}
                                fullWidth></TextField>
                            <FormControl variant="filled" sx={{ minWidth: "100%", marginTop: 2 }}>
                                <InputLabel id="notification">Notification Preference</InputLabel>
                                <Select
                                    labelId="notification"
                                    value={notificationPreference}
                                    onChange={handleNotificationPreferenceChange}
                                    fullWidth
                                    sx={{ marginTop: "5px" }}
                                    inputProps={{ style: { textEmphasisColor: "white" } }}
                                >
                                    <MenuItem value="slack">Slack</MenuItem>
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="telegram">Telegram</MenuItem>
                                    <MenuItem value="discord">Discord</MenuItem>
                                </Select>
                            </FormControl>
                            {notificationPreference === "slack" && (
                                <TextField
                                    label="Slack Webhook URL"
                                    value={slackChannel}
                                    onChange={handleSlackChannelChange}
                                    fullWidth
                                    sx={{ marginTop: "8px" }}
                                />
                            )}
                            {notificationPreference === "email" && (
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                        <TextField
                                            label="Sender Email"
                                            value={emailAddress}
                                            onChange={handleEmailAddressChange}
                                            fullWidth
                                            sx={{ minWidth: "48%", marginRight: "8px" }}
                                        />
                                        <TextField
                                            label="Sender Email Password"
                                            value={senderPassword}
                                            onChange={handleSenderPasswordChange}
                                            type="password"
                                            sx={{ minWidth: "48%" }}
                                        ></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                        <TextField
                                            label="SMTP Server"
                                            value={smtpServer}
                                            onChange={handleSmtpServerChange}
                                            fullWidth
                                            sx={{ minWidth: "48%", marginRight: "8px" }}
                                        />
                                        <TextField
                                            label="SMTP Port"
                                            value={smtpPort}
                                            onChange={handleSmtpPortChange}
                                            fullWidth
                                            sx={{ minWidth: "48%" }}
                                        />
                                    </Box>
                                    <Box sx={{ marginTop: 2 }}>
                                        <TextField
                                            label="Recipient Email"
                                            value={inputValue}
                                            onChange={handleRecipientEmailsChange}
                                            onKeyDown={handleKeyDown}
                                            fullWidth
                                        />
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 1,
                                                mt: 2,
                                                p: 1,
                                                backgroundColor: "transparent",
                                                boxShadow: "none",
                                            }}
                                        >
                                            {recipientEmails.map((email, index) => (
                                                <Chip key={index} label={email} onDelete={() => handleDelete(email)} />
                                            ))}
                                        </Paper>
                                    </Box>
                                </Box>
                            )}
                            {notificationPreference === "telegram" && (
                                <TextField
                                    label="Telegram Chat ID"
                                    value={telegramChatId}
                                    onChange={handleTelegramChatIdChange}
                                    fullWidth
                                    sx={{ marginTop: "8px" }}
                                />
                            )}
                            {notificationPreference === "discord" && (
                                <TextField
                                    label="Discord Channel"
                                    value={discordChannel}
                                    onChange={handleDiscordChannelChange}
                                    fullWidth
                                    sx={{ marginTop: "8px" }}
                                />
                            )}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};


export default Configuration;

