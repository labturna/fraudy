import React, { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { SelectChangeEvent, Switch } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { de } from 'date-fns/locale/de';
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
} from "@mui/material";
import Navbar from "../components/Navbar";
import AlertsTable from "../components/AlertsTable";
import NotificationDropdown from "../components/NotificationDropdown";

const CreateAlert: React.FC = () => {
    const [alertName, setAlertName] = useState("");
    const [walletId, setWalletId] = useState("");
    const [ruleType, setRuleType] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [transactionThreshold, setTransactionThreshold] = useState("");
    const [timeFrame, setTimeFrame] = useState("");
    const [transactionStatus, setTransactionStatus] = useState(true);

    const handleNotificationChange = (notifications: string[]) => {
        setSelectedNotifications(notifications);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleAlertNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAlertName(event.target.value);
    };

    const handleWalletIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWalletId(event.target.value as string);
    };

    const handleRuleTypeChange = (event: SelectChangeEvent<string>) => {
        setRuleType(event.target.value as string);
    };
    const handleTransactionThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionThreshold(event.target.value);
    };

    const handleTimeFrameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeFrame(event.target.value);
    };
    const handleTransactionStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionStatus(event.target.checked);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("jwtToken"); // Kullanıcının oturum token'ı
        if (!token) {
            alert("Unauthorized: Please log in.");
            return;
        }
        const payload: any = {
            AlertName: alertName,
            RuleType: ruleType,
            NotificationPreferences: JSON.stringify(selectedNotifications),
            WalletID: walletId,
            TransactionThreshold : transactionThreshold ? parseFloat(transactionThreshold) : 0,
            TimeFrame : timeFrame ? parseInt(timeFrame) : 0,
            TransactionStatus : transactionStatus,
        };
    
        try {
            const response = await fetch("http://localhost:8080/api/create-alert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error("Failed to create alert.");
            }
    
            const data = await response.json();
            console.log("✅ Alert Created:", data);
            alert("Alert created successfully!");
    
            // Modal'ı kapat ve formu sıfırla
            handleCloseModal();
            setAlertName("");
            setWalletId("");
            setRuleType("");
            setTransactionThreshold("");
            setTimeFrame("");
            setTransactionStatus(true);
            setSelectedNotifications([]);
        } catch (error) {
            console.error("❌ Error:", error);
            alert("An error occurred while creating the alert.");
        }
    };
    

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
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
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                    <Typography variant="h4">Your Alerts</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>
                        Create Alert
                    </Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", width: "70%" }}>
                    <AlertsTable />
                </Box>

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
                                    Create Alert
                                </Typography>
                                <TextField
                                    label="Alert Name"
                                    value={alertName}
                                    onChange={handleAlertNameChange}
                                    fullWidth
                                />
                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                    <FormControl variant="filled" sx={{ minWidth: "100%" }}>
                                        <TextField
                                            label="Wallet ID"
                                            value={walletId}
                                            onChange={handleWalletIdChange}
                                            fullWidth
                                        />
                                    </FormControl>
                                </Box>
                                <FormControl variant="filled" sx={{ minWidth: "100%", marginTop: 2 }}>
                                    <InputLabel id="rule">Rule</InputLabel>
                                    <Select
                                        labelId="rule"
                                        value={ruleType}
                                        onChange={handleRuleTypeChange}
                                        fullWidth
                                        sx={{ marginTop: "5px" }}
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
                                    <Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <TextField
                                                label="Transaction Threshold"
                                                type="number"
                                                value={transactionThreshold}
                                                onChange={handleTransactionThresholdChange}
                                                fullWidth
                                                sx={{ marginTop: 2, marginRight: 2 }}
                                            />
                                            <TextField
                                                label="Time Frame (minutes)"
                                                type="number"
                                                value={timeFrame}
                                                onChange={handleTimeFrameChange}
                                                fullWidth
                                                sx={{ marginTop: 2 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2, alignItems: 'center' }}>
                                            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Typography sx={{ marginRight: 1 }}>Transaction Status : </Typography>
                                                <Switch checked={transactionStatus} onChange={handleTransactionStatusChange} color="warning" />
                                                <Typography sx={{ marginLeft: 1 }}>{transactionStatus ? "True" : "False"}</Typography>
                                            </FormControl>
                                        </Box>


                                    </Box>
                                )}
                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
                                    <NotificationDropdown
                                        selectedNotifications={selectedNotifications}
                                        onChange={handleNotificationChange}
                                    />
                                </Box>
                                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
                                    Create Alert
                                </Button>
                            </Container>
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </LocalizationProvider>
    );
};

export default CreateAlert;
