// src/pages/DoctorAppointmentsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api';
import { AppContext } from '../context/AppContext';

const DoctorAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'upcoming', 'past'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/appointments/');
                const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAppointments(sorted);
            } catch (err) {
                setError('Failed to load appointments.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    const isToday = (dateStr) => {
        const today = new Date().toDateString();
        const appointmentDate = new Date(dateStr).toDateString();
        return today === appointmentDate;
    };

    const isPast = (dateStr) => {
        const today = new Date();
        const appointmentDate = new Date(dateStr);
        return appointmentDate < today;
    };

    const filteredAppointments = appointments.filter(appt => {
        // Status filter
        const statusMatch = filter === 'all' || appt.status === filter;
        
        // Date filter
        let dateMatch = true;
        if (dateFilter === 'today') {
            dateMatch = isToday(appt.date);
        } else if (dateFilter === 'upcoming') {
            dateMatch = !isPast(appt.date);
        } else if (dateFilter === 'past') {
            dateMatch = isPast(appt.date);
        }
        
        // Search filter
        const searchMatch = searchTerm === '' || 
            appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return statusMatch && dateMatch && searchMatch;
    });

    const statusFilters = [
        { key: 'all', label: 'All', count: appointments.length },
        { key: 'scheduled', label: 'Scheduled', count: appointments.filter(a => a.status === 'scheduled').length },
        { key: 'completed', label: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
        { key: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length },
        { key: 'no_show', label: 'No Show', count: appointments.filter(a => a.status === 'no_show').length }
    ];

    const dateFilters = [
        { key: 'all', label: 'All Time' },
        { key: 'today', label: 'Today' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'past', label: 'Past' }
    ];

    const todayAppointments = appointments.filter(appt => isToday(appt.date));
    const upcomingAppointments = appointments.filter(appt => !isPast(appt.date) && !isToday(appt.date));

    if (loading) {
        return (
            <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">Manage and track your patient appointments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today</p>
                                <p className="text-3xl font-bold text-blue-600">{todayAppointments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-3xl font-bold text-orange-600">{upcomingAppointments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{appointments.filter(a => a.status === 'completed').length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Date Filter */}
                        <div className="flex gap-2">
                            {dateFilters.map(df => (
                                <button
                                    key={df.key}
                                    onClick={() => setDateFilter(df.key)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                        dateFilter === df.key 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {df.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                        {statusFilters.map(sf => (
                            <button
                                key={sf.key}
                                onClick={() => setFilter(sf.key)}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                                    filter === sf.key 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                {sf.label}
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                    filter === sf.key ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                    {sf.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Appointments Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Appointments ({filteredAppointments.length})
                        </h3>
                    </div>

                    {filteredAppointments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map(appt => (
                                        <tr key={appt.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {appt.patient_name?.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {appt.patient_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {appt.patient}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(appt.date)}</div>
                                                {isToday(appt.date) && (
                                                    <div className="text-xs text-blue-600 font-medium">Today</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatTime(appt.time)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(appt.status)}
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-500">No appointments match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DoctorAppointmentsPage;