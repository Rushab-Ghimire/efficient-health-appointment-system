// src/pages/DoctorDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import apiClient from '../api';

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

    const formatTime = (timeStr) => {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            no_show: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        
        const statusLabels = {
            scheduled: 'Scheduled',
            completed: 'Completed',
            cancelled: 'Cancelled',
            no_show: 'No Show'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || statusStyles.scheduled}`}>
                {statusLabels[status] || status}
            </span>
        );
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800">{error}</p>
                </div>
            </main>
        );
    }

    if (!dashboardData) {
        return (
            <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="text-center py-12">
                    <p className="text-gray-500">No data available.</p>
                </div>
            </main>
        );
    }

    const { todays_appointments, stats, doctor_name } = dashboardData;

    return (
        <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, Dr. {doctor_name} 👋
                            </h1>
                            <p className="text-gray-600 text-lg">{getCurrentDate()}</p>
                        </div>
                        <div className="mt-4 lg:mt-0 text-right">
                            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                                <p className="text-sm text-gray-500">Current Time</p>
                                <p className="text-2xl font-bold text-blue-600">{getCurrentTime()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total_patients}</p>
                                <p className="text-xs text-green-600 mt-1">All unique patients</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today's Schedule</p>
                                <p className="text-3xl font-bold text-green-600">{stats.today_appointments_count}</p>
                                <p className="text-xs text-blue-600 mt-1">Appointments today</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Week</p>
                                <p className="text-3xl font-bold text-indigo-600">{stats.appointments_this_week}</p>
                                <p className="text-xs text-purple-600 mt-1">Scheduled appointments</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.completion_rate_percent}%</p>
                                <p className="text-xs text-green-600 mt-1">Success rate</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Schedule */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Today's Schedule</h2>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                        {todays_appointments.length} appointments
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {todays_appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {todays_appointments.map((appt, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {appt.patient_name?.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{appt.patient_name}</p>
                                                        <p className="text-sm text-gray-500">Patient consultation</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">{formatTime(appt.time)}</p>
                                                        <p className="text-xs text-gray-500">Duration: 30 min</p>
                                                    </div>
                                                    {getStatusBadge(appt.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                                        <p className="text-gray-500">You have a free day! Enjoy your time off.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                                <h2 className="text-lg font-semibold">Recent Activity</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-600">Dashboard accessed</span>
                                        <span className="text-gray-400 ml-auto">Just now</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-600">Appointments loaded</span>
                                        <span className="text-gray-400 ml-auto">1 min ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-gray-600">Profile updated</span>
                                        <span className="text-gray-400 ml-auto">2 hrs ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DoctorDashboard;