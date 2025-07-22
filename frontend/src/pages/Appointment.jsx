// src/pages/Appointment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'; // Assuming you have this
import RelatedDoctors from '../components/RelatedDoctors'; // Assuming you have this

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
                setBookedSlots(response.data);
            } catch (err) {
                console.error("Failed to fetch booked slots", err);
                setBookedSlots([]); // On error, assume no slots are booked
            }
        };

        fetchBookedSlots();
    }, [doctor, selectedDate]);

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

        const formattedDate = selectedDate.toISOString().split('T')[0];
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
            const errorMessage = err.response?.data?.detail || Object.values(err.response?.data).flat().join(' ') || 'Failed to book appointment. The time slot may have just been taken.';
            setError(errorMessage);
        }
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
        
        // If selected date is not today, it's not in the past
        if (selectedDateStr !== today) {
            return false;
        }
        
        // If it's today, check if the time has passed
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        
        return slotTime <= now;
    };

    // Helper function to check if a time slot is booked
    const isTimeSlotBooked = (timeSlot) => {
        // 'bookedSlots' is an array of strings. We just need to check if the
        // current 'timeSlot' string is present in that array.
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
                        Dr. {doctor.full_name} {/* CORRECTED */}
                        <img className='w-5' src={assets.verified_icon} alt="Verified" />
                    </p>
                    <p className='text-lg mt-1 text-gray-600'>{doctor.specialization}</p> {/* CORRECTED */}
                    <p className='text-slate-800 font-semibold mt-4 text-lg'>
                        Appointment Fee: Rs {doctor.appointment_fee} {/* CORRECTED */}
                    </p>
                    {/* Add other fields from your DoctorSerializer if needed */}
                </div>
            </div>

            {/* Booking Section */}
            <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
                <p className='text-3xl font-bold text-indigo-700 border-b-2 border-indigo-200 inline-block pb-1'>
                    Book Appointment
                </p>

                {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
                {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
                
                <div className='mt-6'>
                    <p className='text-lg font-semibold text-gray-700 mb-2'>1. Select a Date:</p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setSelectedTime('');
                        }}
                        minDate={new Date()}
                        className='border border-indigo-300 px-4 py-2 rounded-md bg-white'
                    />
                </div>

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

                <button
                    onClick={handleBookingSubmit}
                    className='bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md text-white text-xl px-8 py-4 rounded-full mt-6 hover:scale-105 transition duration-300 disabled:opacity-50'
                    disabled={!selectedTime}
                >
                    Confirm Appointment
                </button>
            </div>
            
            {/* <RelatedDoctors docId={docId} speciality={doctor.specialization} /> */}
        </div>
    );
};

export default Appointment;