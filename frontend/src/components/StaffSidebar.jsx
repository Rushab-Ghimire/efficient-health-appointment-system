// src/components/StaffSidebar.jsx

import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { User, LogOut } from 'lucide-react';
import { assets } from '../assets/assets'; // Your logo asset

const StaffSidebar = () => {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col shadow-lg">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700">
                <img src={assets.logo} alt="Care Connect Logo" className="w-32" />
                <p className="text-sm text-gray-400 mt-2">Staff Panel</p>
            </div>
            
            {/* Welcome Message */}
            {user && (
                <div className="p-6">
                    <p className="text-gray-300">Welcome,</p>
                    <p className="font-bold text-lg">{user.first_name}</p>
                </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-grow p-4 space-y-2">
                <NavLink
                    to="/staff/verify"
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-cyan-600' : 'hover:bg-gray-700'}`
                    }
                >
                    {/* You can add an icon here */}
                    Appointment Verification
                </NavLink>
            </nav>

            {/* Logout Button at the bottom */}
            <div className="p-4 border-t border-gray-700">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default StaffSidebar;