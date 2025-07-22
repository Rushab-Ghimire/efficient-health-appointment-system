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
        // Fetch this patient's appointment history with the doctor
        const response = await apiClient.get(`/api/appointments/?patient_id=${patient.id}`);
        const sorted = response.data.sort((a,b) => new Date(b.date) - new Date(a.date));
        setAppointments(sorted);
        setEditingApptId(null); // Reset editing state
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
            // Refresh patient's appointment history to show the new note
            handleSelectPatient(selectedPatient);
        } catch (error) {
            console.error("Failed to save notes", error);
            alert("Could not save notes.");
        }
    };

    return (
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Patients</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Patient List */}
                <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-md">
                    <h2 className="font-semibold mb-2">Select a Patient</h2>
                    <ul className="space-y-2">
                        {patients.map(p => (
                            <li key={p.id} onClick={() => handleSelectPatient(p)}
                                className={`p-3 rounded-lg cursor-pointer ${selectedPatient?.id === p.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                                {p.first_name} {p.last_name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Appointment History & Notes */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    {selectedPatient ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{selectedPatient.first_name}'s History</h2>
                            {appointments.map(appt => (
                                <div key={appt.id} className="p-4 border rounded-lg mb-4">
                                    <p><strong>Date:</strong> {appt.date} at {appt.time.slice(0,5)} ({appt.status})</p>
                                    
                                    {editingApptId === appt.id ? (
                                        <div className="mt-2">
                                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                                                      className="w-full p-2 border rounded-md" rows="3"></textarea>
                                            <button onClick={handleSaveNotes} className="bg-green-500 text-white px-3 py-1 rounded-md mt-2">Save</button>
                                            <button onClick={() => setEditingApptId(null)} className="ml-2">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                                            <p><strong>Notes:</strong> {appt.doctor_notes || 'No notes yet.'}</p>
                                            <button onClick={() => handleEditNotes(appt)} className="text-blue-600 text-sm mt-1">
                                                {appt.doctor_notes ? 'Edit Notes' : 'Add Notes'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Select a patient to view their appointment history.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DoctorPatientsPage;