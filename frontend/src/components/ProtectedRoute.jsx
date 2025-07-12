// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { token } = useContext(AppContext);

    // If there is no token, redirect to the login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If there is a token, render the child component.
    // <Outlet /> is a placeholder for MyProfile, MyAppointments, etc.
    return <Outlet />;
};

export default ProtectedRoute;