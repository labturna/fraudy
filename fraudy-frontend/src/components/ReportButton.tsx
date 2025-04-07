import React from "react";
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { toast } from "react-toastify";
const ReportButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [reason, setReason] = React.useState("");

  const theme = useTheme();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    const type = tabIndex === 0 ? "wallet" : "phishing";
    console.log(`Reported (${type}):`, { address, reason });
    toast.success("Address reported successfully!");
    setAddress("");
    setReason("");
    handleClose();
  };

  return (
    <>
      <Tooltip title="Report Suspicious Address">
        <Fab
          color="error"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: 4
          }}
        >
          <ReportProblemIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle>Report Suspicious Address</DialogTitle>

        <Tabs value={tabIndex} onChange={(_e, newValue) => setTabIndex(newValue)} centered>
          <Tab label="Wallet" />
          <Tab label="Phishing" />
        </Tabs>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label={tabIndex === 0 ? "Wallet Address" : "Phishing Site / Address"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{ style: { color: theme.palette.text.primary } }}
          />
          <TextField
            label="Reason / Notes"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            InputProps={{ style: { color: theme.palette.text.primary } }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="error">
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportButton;