// src/components/DoctorLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar';

const DoctorLayout = () => {
    return (
        <div className="flex">
            <DoctorSidebar />
            <div className="flex-1">
                {/* Your public Navbar can go here if you want it, or you can omit it for a focused view */}
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorLayout;