import React, { useState } from "react";
import {
    Box, Container, Typography, Button, Modal, Fade, TextField,
    SelectChangeEvent, Select, MenuItem, Chip,
    Paper, FormControl, InputLabel, useTheme, useMediaQuery
} from "@mui/material";
import Navbar from "../components/Navbar";
import ConfigurationTable from "../components/ConfigurationTable";
import { toast } from "react-toastify";
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
    const [refreshConfig, setRefreshConfig] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleSubmit = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            toast.error("Unauthorized: Please log in.");
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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(await response.text());

            toast.success("Configuration saved successfully!");
            setRefreshConfig(prev => !prev);
            resetForm();
        } catch (error: any) {
            console.error("Error saving configuration:", error);
            toast.error("Failed to save configuration: " + error.message);
        }
    };

    const resetForm = () => {
        setConfigName("");
        setNotificationPreference("");
        setSlackChannel("");
        setEmailAddress("");
        setSenderPassword("");
        setSmtpServer("");
        setSmtpPort("");
        setRecipientEmails([]);
        setInputValue("");
        setTelegramChatId("");
        setDiscordChannel("");
        handleCloseModal();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(inputValue.trim())) {
                setRecipientEmails([...recipientEmails, inputValue.trim()]);
                setInputValue("");
            }
        }
    };

    const handleDelete = (emailToDelete: string) => {
        setRecipientEmails(recipientEmails.filter((email) => email !== emailToDelete));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: theme.palette.mode === "dark"
                    ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
                    : "linear-gradient(to right, #ffffff, #f0f4f8)",
                color: theme.palette.text.primary,
            }}
        >
            <Navbar />
            <Container sx={{ pt: 15 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={isMobile ? "column" : "row"} gap={2} mb={4}>
                    <Typography variant="h4" fontWeight={600}>Configurations</Typography>
                    <Button variant="contained" onClick={handleOpenModal}>
                        Create Configuration
                    </Button>
                </Box>

                <ConfigurationTable refreshConfig={refreshConfig} />

                {/* MODAL */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Fade in={openModal}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
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
                            <Typography variant="h5" gutterBottom>Create Configuration</Typography>

                            <TextField
                                label="Configuration Name"
                                fullWidth
                                value={configName}
                                onChange={(e) => setConfigName(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="notif-label">Notification Preference</InputLabel>
                                <Select
                                    labelId="notif-label"
                                    value={notificationPreference}
                                    onChange={(e: SelectChangeEvent<string>) => setNotificationPreference(e.target.value)}
                                    label="Notification Preference"
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
                                    fullWidth
                                    value={slackChannel}
                                    onChange={(e) => setSlackChannel(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {notificationPreference === "email" && (
                                <>
                                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
                                        <TextField
                                            label="Sender Email"
                                            fullWidth
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                        />
                                        <TextField
                                            label="Sender Password"
                                            fullWidth
                                            type="password"
                                            value={senderPassword}
                                            onChange={(e) => setSenderPassword(e.target.value)}
                                        />
                                    </Box>
                                    <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
                                        <TextField
                                            label="SMTP Server"
                                            fullWidth
                                            value={smtpServer}
                                            onChange={(e) => setSmtpServer(e.target.value)}
                                        />
                                        <TextField
                                            label="SMTP Port"
                                            fullWidth
                                            value={smtpPort}
                                            onChange={(e) => setSmtpPort(e.target.value)}
                                        />
                                    </Box>
                                    <Box mb={2}>
                                        <TextField
                                            label="Recipient Email"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
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
                                                <Chip
                                                    key={index}
                                                    label={email}
                                                    onDelete={() => handleDelete(email)}
                                                />
                                            ))}
                                        </Paper>
                                    </Box>
                                </>
                            )}

                            {notificationPreference === "telegram" && (
                                <TextField
                                    label="Telegram Chat ID"
                                    fullWidth
                                    value={telegramChatId}
                                    onChange={(e) => setTelegramChatId(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {notificationPreference === "discord" && (
                                <TextField
                                    label="Discord Channel"
                                    fullWidth
                                    value={discordChannel}
                                    onChange={(e) => setDiscordChannel(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            <Box display="flex" justifyContent="flex-end">
                                <Button variant="contained" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </Container>
        </Box>
    );
};

export default Configuration;
