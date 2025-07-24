// src/pages/DoctorPatientsPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api';

const DoctorPatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState('');
    const [editingApptId, setEditingApptId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/api/doctor/patients/');
                setPatients(response.data);
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleSelectPatient = async (patient) => {
        setSelectedPatient(patient);
        try {
            const response = await apiClient.get(`/api/appointments/?patient_id=${patient.id}`);
            const sorted = response.data.sort((a,b) => new Date(b.date) - new Date(a.date));
            setAppointments(sorted);
            setEditingApptId(null);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const handleEditNotes = (appointment) => {
        setEditingApptId(appointment.id);
        setNotes(appointment.doctor_notes || '');
    };

    const handleSaveNotes = async () => {
        try {
            await apiClient.patch(`/api/appointments/${editingApptId}/`, {
                doctor_notes: notes
            });
            handleSelectPatient(selectedPatient);
            setEditingApptId(null);
        } catch (error) {
            console.error("Failed to save notes", error);
            alert("Could not save notes.");
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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

    const filteredPatients = patients.filter(patient =>
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Patients</h1>
                    <p className="text-gray-600">Manage patient records and appointment history</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Patient Sidebar */}
                    <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <h2 className="text-xl font-semibold mb-4">Patients Directory</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {filteredPatients.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    No patients found
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredPatients.map(patient => (
                                        <div
                                            key={patient.id}
                                            onClick={() => handleSelectPatient(patient)}
                                            className={`p-4 cursor-pointer transition-all duration-200 ${
                                                selectedPatient?.id === patient.id
                                                    ? 'bg-blue-50 border-r-4 border-blue-500'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                                    selectedPatient?.id === patient.id ? 'bg-blue-500' : 'bg-gray-400'
                                                }`}>
                                                    {patient.first_name[0]}{patient.last_name[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {patient.first_name} {patient.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {patient.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patient Details & History */}
                    <div className="lg:col-span-8">
                        {selectedPatient ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                {/* Patient Header */}
                                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                                                {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {selectedPatient.first_name} {selectedPatient.last_name}
                                                </h2>
                                                <p className="text-gray-600">{selectedPatient.email}</p>
                                                {selectedPatient.phone_number && (
                                                    <p className="text-gray-600">{selectedPatient.phone_number}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total Appointments</p>
                                            <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment History */}
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
                                    
                                    {appointments.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                            </svg>
                                            <p className="text-gray-500">No appointments found for this patient</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {appointments.map(appt => (
                                                <div key={appt.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{formatDate(appt.date)}</p>
                                                                <p className="text-gray-600">{formatTime(appt.time)}</p>
                                                            </div>
                                                        </div>
                                                        {getStatusBadge(appt.status)}
                                                    </div>

                                                    {/* Notes Section */}
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">Clinical Notes</h4>
                                                            {editingApptId !== appt.id && (
                                                                <button
                                                                    onClick={() => handleEditNotes(appt)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                                                                >
                                                                    {appt.doctor_notes ? 'Edit Notes' : 'Add Notes'}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {editingApptId === appt.id ? (
                                                            <div className="space-y-3">
                                                                <textarea
                                                                    value={notes}
                                                                    onChange={(e) => setNotes(e.target.value)}
                                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                                    rows="4"
                                                                    placeholder="Enter clinical notes..."
                                                                />
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={handleSaveNotes}
                                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                                                    >
                                                                        Save Notes
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingApptId(null)}
                                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-700">
                                                                {appt.doctor_notes ? (
                                                                    <p className="whitespace-pre-wrap">{appt.doctor_notes}</p>
                                                                ) : (
                                                                    <p className="text-gray-500 italic">No notes recorded for this appointment</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Patient</h3>
                                <p className="text-gray-500">Choose a patient from the directory to view their appointment history and manage clinical notes</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DoctorPatientsPage;