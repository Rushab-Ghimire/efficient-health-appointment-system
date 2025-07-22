// src/pages/DoctorAppointmentsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api';
import { AppContext } from '../context/AppContext';

const DoctorAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'completed', etc.

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/appointments/');
                // Sort by date, most recent first
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

    const filteredAppointments = appointments.filter(appt => 
        filter === 'all' || appt.status === filter
    );

    const statusFilters = ['all', 'scheduled', 'completed', 'cancelled', 'no_show'];

    return (
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2 mb-6">
                {statusFilters.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                            filter === status 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </button>
                ))}
            </div>

            {loading && <p>Loading appointments...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left font-semibold text-gray-600">Patient</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Time</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(appt => (
                                    <tr key={appt.id} className="border-b last:border-none">
                                        <td className="p-4">{appt.patient_name}</td>
                                        <td className="p-4">{appt.date}</td>
                                        <td className="p-4">{appt.time.slice(0,5)}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize ..."> {/* Your status styles */}
                                                {appt.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No appointments found for this filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};

export default DoctorAppointmentsPage;