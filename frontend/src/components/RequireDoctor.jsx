// src/components/RequireDoctor.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const RequireDoctor = () => {
    const { user, loading } = useContext(AppContext);

    if (loading) {
        return <div>Verifying credentials...</div>;
    }

    if (user && user.role === 'doctor') {
        return <Outlet />;
    }
    
    return <Navigate to="/login" replace />;
};

export default RequireDoctor;