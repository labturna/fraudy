import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import CreateAlert from "./pages/CreateAlert";
import Configuration from "./pages/Configuration";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PrivateRoute from "./context/AuthContext";
const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
        <Route path="/create-alert" element={<PrivateRoute><CreateAlert /></PrivateRoute>} />
        <Route path="/configuration" element={<PrivateRoute><Configuration /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

export default App;
