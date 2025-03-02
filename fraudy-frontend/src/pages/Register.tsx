import React from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Divider, FormControl, Link } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginImage from "../assets/img/login-img.jpg";

const RegisterPage: React.FC = () => {
    const [username, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const handleSubmit = async () => {
        if (username.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
            alert("Please fill all fields.");
            return;
        }
        if (password.trim()!== confirmPassword.trim()) {
            alert("Passwords do not match.");
            return;
        }
        const payload = {
            username,
            email,
            password,
        }
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error("Registration failed.");
            }
            alert("Registration successful. You can now log in.");
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            alert("An error occurred while registering. Please try again later.");
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
                        Register
                    </Typography>
                    <TextField sx={{ color: "white" }} label="Full Name" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }} value={username} onChange={(e) => setFullName(e.target.value)} />
                    <TextField sx={{ color: "white" }} label="Email" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }} value={email}
            onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }} value={password}
            onChange={(e) => setPassword(e.target.value)} />
                    <TextField label="Confirm Password" type="password" variant="outlined" fullWidth InputLabelProps={{ sx: { color: "white" } }} value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <Button variant="contained" sx={{ color: "white", backgroundColor: "primary" }} fullWidth onClick={handleSubmit}>
                        Register
                    </Button>
                    <FormControl>
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="white">
                                You already have an account?
                            </Typography>
                            <Typography variant="body2" color="white">
                                <Link href="/login" sx={{ color: "white", textDecoration: 'none' }}>Sign In</Link>
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
export default RegisterPage;