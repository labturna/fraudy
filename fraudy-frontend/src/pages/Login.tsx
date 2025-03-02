import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Divider, FormControl, Link } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginImage from "../assets/img/login-img.jpg";
import { useNavigate } from "react-router-dom";
const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please fill in both fields.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                credentials: "include", // include cookies if needed
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Login failed.");
            }
            const data = await response.json();
            // Assuming your backend returns { token: "..." }
            if (data.token) {
                localStorage.setItem("jwtToken", data.token);
                alert("Login successful!");
                navigate("/");
            } else {
                alert("Login failed: no token received.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    };
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    width: 800,
                    borderRadius: 3,
                    boxShadow: 3,
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    backgroundColor: "rgb(90, 126, 223)",
                    border: "1px solid rgba(93, 131, 214, 0.3)",
                }}
            >
                {/* Sol Taraf - Görsel */}
                <Box
                    sx={{
                        width: "40%",
                        backgroundImage: `url(${LoginImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "12px 0 0 12px"
                    }}
                />

                <CardContent sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center">
                        Login
                    </Typography>

                    <TextField sx={{ color: "white" }} label="Email" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }}  value={email}
            onChange={(e) => setEmail(e.target.value)}/>
                    <TextField label="Password" type="password" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }} value={password}
            onChange={(e) => setPassword(e.target.value)} />

                    <Button variant="contained" sx={{ color: "white", backgroundColor: "primary" }} fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                    <FormControl>
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="white">
                                Forgot Password?
                            </Typography>
                            <Typography variant="body2" color="white">
                                <Link href="/register" sx={{ color: "white", textDecoration: 'none' }}>Sign up</Link>
                            </Typography>
                        </Box>
                    </FormControl>

                    <Divider sx={{
                        "&::before, &::after": {
                            borderColor: "white",
                        },
                    }} >OR</Divider>

                    <Button
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        fullWidth
                        sx={{ textTransform: "none", color: "white" }}
                    >
                        Login with Google
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
