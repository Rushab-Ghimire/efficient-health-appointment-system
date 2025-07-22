// src/pages/DoctorDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import apiClient from '../api';
import { FaUserInjured, FaCalendarCheck, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

// --- Reusable Sub-Components ---
const Card = ({ title, value, Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-4 border border-gray-100">
        <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            <Icon className={`text-2xl ${color}`} />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AppointmentRow = ({ name, time, status }) => {
    const statusStyles = {
        scheduled: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        'no_show': 'bg-yellow-100 text-yellow-700',
    };

    return (
        <div className="flex justify-between items-center py-3 border-b last:border-none">
            <span className="font-medium text-gray-700">{name}</span>
            <span className="text-gray-500">{time}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[status] || 'bg-gray-100'}`}>
                {status.replace('_', ' ')}
            </span>
        </div>
    );
};


const DoctorDashboard = () => {
    const { user } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/doctor/dashboard-data/');
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!dashboardData) return <div className="p-10 text-center">No data available.</div>;

    const { todays_appointments, stats, doctor_name } = dashboardData;

    return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, Dr. {doctor_name} 👋</h1>
      
        {/* The Card grid is self-contained and correct */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card title="Total Unique Patients" value={stats.total_patients} Icon={FaUserInjured} color="text-blue-500" />
            <Card title="Today's Scheduled" value={stats.today_appointments_count} Icon={FaCalendarCheck} color="text-green-500" />
            <Card title="Scheduled This Week" value={stats.appointments_this_week} Icon={FaCalendarAlt} color="text-indigo-500" />
            <Card title="Completion Rate" value={`${stats.completion_rate_percent}%`} Icon={FaChartLine} color="text-purple-500" />
        </div>
      
        {/* Main content grid for appointments and other sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left column for appointments */}
            <section className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Schedule</h2>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    {todays_appointments.length > 0 ? (
                        todays_appointments.map((appt, i) => (
                            <AppointmentRow key={i} name={appt.patient_name} time={appt.time.slice(0,5)} status={appt.status} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">You have no appointments on the books for today.</p>
                    )}
                </div>
            </section>

            {/* Right column for other actions */}
            <section className="lg:col-span-1">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
                    <p className="text-gray-500 text-center">Future quick actions, like "Manage Availability" can go here.</p>
                </div>
            </section>

        </div> {/* This closing div matches the grid */}
    </main> /* This closing main tag is now correct */
);
};

export default DoctorDashboard;