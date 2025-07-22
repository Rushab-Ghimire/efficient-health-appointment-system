import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireStaff = () => {
    // Read both token and user role from localStorage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    // User must be logged in AND have the role of 'admin'
    if (token && role === 'admin') {
        return <Outlet />;
    }

    // Redirect if they don't meet the criteria
    return <Navigate to="/" replace />;
};
export default RequireStaff;