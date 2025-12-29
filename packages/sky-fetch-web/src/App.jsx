import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './layouts/DashboardLayout';
import LogsView from './pages/LogsView';
import KeysView from './pages/KeysView';
import Profile from './pages/Profile';
import OrganizationSettings from './pages/OrganizationSettings';
import MonitoringView from './pages/MonitoringView';
import LandingPage from './pages/LandingPage';

function App() {
    // Simple verification - in a real app use Context
    const isAuthenticated = () => !!localStorage.getItem('token');

    const PrivateRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={
                <PrivateRoute>
                    <DashboardLayout />
                </PrivateRoute>
            }>
                <Route index element={<LogsView />} />
                <Route path="keys" element={<KeysView />} />
                <Route path="profile" element={<Profile />} />
                <Route path="organizations" element={<OrganizationSettings />} />
                <Route path="monitoring" element={<MonitoringView />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
