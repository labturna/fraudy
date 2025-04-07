import React, { useState } from "react";
import {
    Box, Card, CardContent, TextField, Button, Typography, Divider, Link,
    IconButton, InputAdornment
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
const RegisterPage: React.FC = () => {
    const [username, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async () => {
        if (!username || !email || !password || !confirmPassword) {
            toast.warning("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            toast.warning("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) throw new Error("Registration failed.");
            toast.success("Registration successful! Please log in.");
            window.location.href = "/login";
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration.");
        }
    };

    return (
        <Box sx={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
            padding: 2
        }}>
            <Card sx={{
                width: 400,
                borderRadius: 4,
                boxShadow: 8,
                backgroundColor: "rgba(18, 32, 47, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e0e0e0",
                p: 4
            }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center">Create Your Account</Typography>

                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setFullName(e.target.value)}
                        InputLabelProps={{ sx: { color: "#e0e0e0" } }}
                        InputProps={{
                            sx: { color: "#e0e0e0", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" } }
                        }}
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{ sx: { color: "#e0e0e0" } }}
                        InputProps={{
                            sx: { color: "#e0e0e0", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" } }
                        }}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{ sx: { color: "#e0e0e0" } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: "#e0e0e0" }}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { color: "#e0e0e0", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" } }
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputLabelProps={{ sx: { color: "#e0e0e0" } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: "#e0e0e0" }}>
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { color: "#e0e0e0", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" } }
                        }}
                    />

                    <Button variant="contained" fullWidth onClick={handleSubmit} sx={{
                        py: 1.5,
                        background: "linear-gradient(to right, #1c92d2, #f2fcfe)",
                        color: "#0f2027",
                        fontWeight: "bold"
                    }}>
                        Register
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">Already have an account?</Typography>
                        <Link href="/login" underline="hover" sx={{ color: "#e0e0e0" }}>Sign in</Link>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }}>OR</Divider>

                    <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth sx={{
                        color: "#e0e0e0",
                        borderColor: "#e0e0e0",
                        textTransform: "none",
                        ":hover": { backgroundColor: "rgba(255,255,255,0.1)" }
                    }}>
                        Register with Google
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterPage;
