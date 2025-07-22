// src/components/DoctorSidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';

const DoctorSidebar = () => {
    const { logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white shadow-lg flex flex-col h-screen">
            <div className="p-6 text-2xl font-bold border-b text-blue-700 flex items-center gap-2">
                <span className="text-3xl">🩺</span> Smart Health
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <NavLink to="/doctor-dashboard" end className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/doctor-dashboard/appointments" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Calendar size={20} /> Appointments
                </NavLink>
                <NavLink to="/doctor-dashboard/patients" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Users size={20} /> Patients
                </NavLink>
            </nav>
            <div className="p-4 border-t">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50">
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;