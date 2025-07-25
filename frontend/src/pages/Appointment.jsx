// src/pages/Appointment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AppContext);

    // --- State Management ---
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    
    // NEW: Add these states for duplicate booking prevention
    const [existingAppointment, setExistingAppointment] = useState(null);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (!docId) return;
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/doctors/${docId}/`);
                setDoctor(response.data);
            } catch (err) {
                setError('Could not find the requested doctor. Please go back and select another.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorDetails();
    }, [docId]);

    useEffect(() => {
        if (!doctor || !selectedDate) return;

        const fetchBookedSlots = async () => {
            try {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                const response = await apiClient.get(`/api/booked-slots/?doctor_id=${doctor.id}&date=${formattedDate}`);
                
                // NEW: Check if response includes existing appointment info
                if (response.data.patient_existing_appointment) {
                    setExistingAppointment(response.data.patient_existing_appointment);
                    setShowDuplicateWarning(true);
                    setBookedSlots(response.data.booked_times || []);
                } else {
                    setExistingAppointment(null);
                    setShowDuplicateWarning(false);
                    // Handle both old and new API response formats
                    setBookedSlots(Array.isArray(response.data) ? response.data : response.data.booked_times || []);
                }
            } catch (err) {
                console.error("Failed to fetch booked slots", err);
                setBookedSlots([]);
                setExistingAppointment(null);
                setShowDuplicateWarning(false);
            }
        };

        fetchBookedSlots();
    }, [doctor, selectedDate]);

    // NEW: Add function to check for duplicate bookings
    const checkForDuplicateBooking = async (doctorId, date) => {
        if (!token || user?.role !== 'patient') return;
        
        try {
            const response = await apiClient.post('/api/appointments/check-availability/', {
                doctor_id: doctorId,
                date: date
            });
            
            if (!response.data.available) {
                setExistingAppointment(response.data.existing_appointment);
                setShowDuplicateWarning(true);
                return false;
            } else {
                setExistingAppointment(null);
                setShowDuplicateWarning(false);
                return true;
            }
        } catch (err) {
            console.error("Error checking for duplicate booking:", err);
            return true; // Allow booking if check fails
        }
    };

    // --- Event Handlers ---
    const handleBookingSubmit = async () => {
        if (!token || user?.role !== 'patient') {
            alert('Please log in as a patient to book an appointment.');
            navigate('/login');
            return;
        }
        if (!selectedTime) {
            setError('Please select an available time slot.');
            return;
        }

        // Clear any previous errors
        setError('');
        setSuccess('');

    const formattedDate = selectedDate.getFullYear() + '-' + 
    String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
    String(selectedDate.getDate()).padStart(2, '0');        console.log('=== DATE DEBUG ===');
        console.log('selectedDate object:', selectedDate);
        console.log('selectedDate.toISOString():', selectedDate.toISOString());
        console.log('formattedDate being sent:', formattedDate);
        console.log('Today in browser:', new Date().toISOString().split('T')[0]);
        console.log('Browser timezone offset:', new Date().getTimezoneOffset());
        
        const payload = {
            doctor_id: doctor.id,
            date: formattedDate,
            time: selectedTime,
        };


        try {
            await apiClient.post('/api/appointments/', payload);
            setSuccess('Appointment booked successfully! You will be redirected shortly.');
            setTimeout(() => navigate('/my-appointments'), 2500);
        } catch (err) {
            // Handle duplicate booking errors and stay on the same page
            if (err.response?.data?.non_field_errors) {
                const errorMsg = err.response.data.non_field_errors[0];
                setError(errorMsg);
                // Don't navigate away, let user see the error and choose different date
                return;
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
                return;
            } else {
                // Handle other error formats
                const errorMessage = Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to book appointment. The time slot may have just been taken.';
                setError(errorMessage);
                return;
            }
        }
    };

    // NEW: Add handler for managing existing appointment
    const handleManageExistingAppointment = () => {
        navigate('/my-appointments');
    };

    // --- Helper Logic (runs on every render) ---
    const generateTimeSlots = (startStr, endStr) => {
        if (!startStr || !endStr) return [];
        const slots = [];
        let currentTime = new Date(`1970-01-01T${startStr}`);
        const endTime = new Date(`1970-01-01T${endStr}`);
        while (currentTime < endTime) {
            slots.push(currentTime.toTimeString().slice(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        return slots;
    };

    // Helper function to check if a time slot is in the past
    const isTimeSlotInPast = (timeSlot) => {
        const now = new Date();
        const today = now.toDateString();
        const selectedDateStr = selectedDate.toDateString();
        
        if (selectedDateStr !== today) {
            return false;
        }
        
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        
        return slotTime <= now;
    };

    // Helper function to check if a time slot is booked
    const isTimeSlotBooked = (timeSlot) => {
        return bookedSlots.includes(timeSlot);
    };

    // Helper function to get slot status
    const getSlotStatus = (timeSlot) => {
        if (isTimeSlotInPast(timeSlot)) {
            return 'past';
        }
        if (isTimeSlotBooked(timeSlot)) {
            return 'booked';
        }
        return 'available';
    };
    
    // --- Render Logic ---
    if (loading) return <div className="text-center p-10 font-semibold">Loading Doctor's Profile...</div>;
    if (error) return <div className="text-center p-10 text-red-600 font-semibold">{error}</div>;
    if (!doctor) return <div className="text-center p-10">Doctor information not found.</div>;

    const availableTimeSlots = generateTimeSlots(doctor.available_from, doctor.available_to);

    return (
        <div className='bg-gradient-to-b from-white via-indigo-50 to-blue-100 pb-20'>
            {/* Doctor Info */}
            <div className='flex flex-col sm:flex-row gap-6 px-4 py-6'>
                <div className='rounded-2xl overflow-hidden shadow-md bg-white border border-indigo-100 p-4'>
                    <img
                        className='bg-indigo-100 w-full px-3 py-2 max-w-[400px] h-auto object-cover rounded-xl'
                        src={doctor.image || 'https://via.placeholder.com/400'}
                        alt={`Dr. ${doctor.full_name}`}
                    />
                </div>
                <div className='flex-1 border border-indigo-200 rounded-2xl p-6 bg-white'>
                    <p className='flex items-center gap-2 text-2xl font-bold text-slate-800'>
                        Dr. {doctor.full_name}
                        <img className='w-5' src={assets.verified_icon} alt="Verified" />
                    </p>
                    <p className='text-lg mt-1 text-gray-600'>{doctor.specialization}</p>
                    <p className='text-slate-800 font-semibold mt-4 text-lg'>
                        Appointment Fee: Rs {doctor.appointment_fee}
                    </p>
                </div>
            </div>

            {/* Booking Section */}
            <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
                <p className='text-3xl font-bold text-indigo-700 border-b-2 border-indigo-200 inline-block pb-1'>
                    Book Appointment
                </p>

                {/* NEW: Duplicate booking warning */}
                {showDuplicateWarning && existingAppointment && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    You already have an appointment
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        You have an existing appointment with Dr. {doctor.full_name} on{' '}
                                        {selectedDate.toLocaleDateString()} at {existingAppointment.time}.
                                        You cannot book another appointment on the same day.
                                    </p>
                                </div>
                                <div className="mt-3">
                                    <button
                                        onClick={handleManageExistingAppointment}
                                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm hover:bg-yellow-200 transition"
                                    >
                                        Manage Existing Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced error display */}
                {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 font-semibold">{success}</p>
                    </div>
                )}
                
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-red-600 font-semibold">{error}</p>
                                {error.includes('already have an appointment') && (
                                    <div className="mt-2">
                                        <button
                                            onClick={() => navigate('/my-appointments')}
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition"
                                        >
                                            View My Appointments
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className='mt-6'>
                    <p className='text-lg font-semibold text-gray-700 mb-2'>1. Select a Date:</p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setSelectedTime('');
                            setError(''); // Clear any previous errors
                        }}
                        minDate={new Date()}
                        className='border border-indigo-300 px-4 py-2 rounded-md bg-white'
                    />
                </div>

                {/* NEW: Only show time slots if no duplicate booking warning */}
                {!showDuplicateWarning && (
                    <div className='mt-6 max-w-sm'>
                        <p className='text-lg font-semibold text-gray-700 mb-2'>2. Select an Available Time:</p>
                        
                        {/* Legend */}
                        <div className='mb-4 flex flex-wrap gap-4 text-sm'>
                            <div className='flex items-center gap-2'>
                                <div className='w-4 h-4 bg-indigo-500 rounded'></div>
                                <span>Available</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-4 h-4 bg-red-400 rounded'></div>
                                <span>Booked</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='w-4 h-4 bg-gray-400 rounded'></div>
                                <span>Past Time</span>
                            </div>
                        </div>

                        {availableTimeSlots.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                {availableTimeSlots.map((time, index) => {
                                    const slotStatus = getSlotStatus(time);
                                    const isUnavailable = slotStatus === 'past' || slotStatus === 'booked';
                                    const isSelected = selectedTime === time;
                                    
                                    let buttonClass = 'p-2 border rounded-md text-center transition text-sm ';
                                    
                                    if (isUnavailable) {
                                        if (slotStatus === 'past') {
                                            buttonClass += 'bg-gray-400 text-white cursor-not-allowed opacity-60';
                                        } else if (slotStatus === 'booked') {
                                            buttonClass += 'bg-red-400 text-white cursor-not-allowed opacity-80';
                                        }
                                    } else if (isSelected) {
                                        buttonClass += 'bg-indigo-500 text-white';
                                    } else {
                                        buttonClass += 'hover:bg-indigo-100 border-indigo-200';
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => !isUnavailable && setSelectedTime(time)}
                                            className={buttonClass}
                                            disabled={isUnavailable}
                                            title={
                                                slotStatus === 'past' 
                                                    ? 'This time slot has passed' 
                                                    : slotStatus === 'booked' 
                                                        ? 'This time slot is already booked' 
                                                        : 'Available'
                                            }
                                        >
                                            {time}
                                            {slotStatus === 'booked' && (
                                                <div className='text-xs mt-1'>Booked</div>
                                            )}
                                            {slotStatus === 'past' && (
                                                <div className='text-xs mt-1'>Past</div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className='text-gray-500'>This doctor has not set their available hours.</p>
                        )}
                    </div>
                )}

                {/* NEW: Only show booking button if no duplicate warning */}
                {!showDuplicateWarning && (
                    <button
                        onClick={handleBookingSubmit}
                        className='bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md text-white text-xl px-8 py-4 rounded-full mt-6 hover:scale-105 transition duration-300 disabled:opacity-50'
                        disabled={!selectedTime}
                    >
                        Confirm Appointment
                    </button>
                )}
            
                {/* NEW: Show message when duplicate warning is active */}
                {showDuplicateWarning && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-4">
                            Please choose a different date or manage your existing appointment.
                        </p>
                    </div>
                )}
            </div>
            
            <RelatedDoctors docId={docId} speciality={doctor.specialization} />
        </div>
    );
};

export default Appointment;