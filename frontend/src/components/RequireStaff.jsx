// src/components/RequireStaff.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Import your global context

const RequireStaff = () => {
    // Get the user and the loading state from our single source of truth.
    const { user, loading } = useContext(AppContext);

    // --- 1. HANDLE THE LOADING STATE ---
    // While the context is still initializing and verifying the token,
    // show a loading message. This prevents a premature redirect.
    if (loading) {
        return <div>Verifying credentials...</div>;
    }

    // --- 2. CHECK PERMISSIONS AFTER LOADING IS COMPLETE ---
    // We check if a user object exists AND if its 'is_staff' property is true.
    if (user && user.is_staff) {
        // If they are staff, render the child route (e.g., the VerificationPage).
        // <Outlet /> is the standard way to do this with react-router-dom v6.
        return <Outlet />;
    }

    // --- 3. REDIRECT IF NOT STAFF ---
    // If loading is finished and the user is not a staff member (or not logged in),
    // redirect them to the homepage or login page.
    return <Navigate to="/" replace />;
};

export default RequireStaff;