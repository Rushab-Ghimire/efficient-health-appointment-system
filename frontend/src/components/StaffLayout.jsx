// src/components/StaffLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar'; // We will create this next

const StaffLayout = () => {
    return (
        <div className="flex min-h-screen">
            <StaffSidebar />
            <main className="flex-grow bg-gray-50">
                <Outlet /> {/* This will render the staff page, e.g., VerificationPage */}
            </main>
        </div>
    );
};

export default StaffLayout;