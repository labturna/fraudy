import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Chip, Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface NotificationDropdownProps {
  selectedNotifications: string[];
  onChange: (notifications: string[]) => void;
}

const notifications = ["Slack", "Email", "Telegram", "Discord"];

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ selectedNotifications, onChange }) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  const handleDelete = (event: React.MouseEvent, notification: string) => {
    event.stopPropagation(); 
    onChange(selectedNotifications.filter((item) => item !== notification));
  };

  return (
    <FormControl variant="filled" fullWidth sx={{ mt: 2 }}>
      <InputLabel id="notification-label">Notifications</InputLabel>
      <Select
        labelId="notification-label"
        multiple
        value={selectedNotifications}
        onChange={handleChange}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                onDelete={(event) => handleDelete(event, value)}
                deleteIcon={
                  <IconButton size="small" onMouseDown={(e) => e.stopPropagation()}>
                    <CancelIcon fontSize="small" />
                  </IconButton>
                }
              />
            ))}
          </Box>
        )}
      >
        {notifications.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NotificationDropdown;
