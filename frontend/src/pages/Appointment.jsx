// src/pages/Appointment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'; // Assuming you have this for icons
import RelatedDoctors from '../components/RelatedDoctors'; // Assuming you have this

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AppContext);

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (!docId) return;
            setLoading(true);
            try {
                const response = await apiClient.get(`/api/doctors/${docId}/`);
                setDoctor(response.data);
            } catch (err) {
                setError('Could not find the requested doctor. Please select another.');
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
                setBookedSlots([]);
            }
        };
        fetchBookedSlots();
    }, [doctor, selectedDate]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
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
            setSuccess('Appointment booked successfully! Redirecting...');
            setTimeout(() => navigate('/my-appointments'), 2500);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || Object.values(err.response?.data).flat().join(' ') || 'Failed to book appointment.';
            setError(errorMessage);
        }
    };

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
    
    if (loading) return <div className="text-center p-10 font-semibold">Loading Doctor's Profile...</div>;
    if (error) return <div className="text-center p-10 text-red-600 font-semibold">{error}</div>;
    if (!doctor) return <div className="text-center p-10">Doctor information not found.</div>;

    const availableTimeSlots = generateTimeSlots(doctor.available_from, doctor.available_to);

    return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
            {/* --- Doctor Info Header --- */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-200">
                <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500"
                    src={doctor.image || 'https://via.placeholder.com/150'}
                    alt={`Dr. ${doctor.full_name}`}
                />
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">Dr. {doctor.full_name}</h1>
                    <p className="text-lg text-cyan-600 font-semibold mt-1">{doctor.specialization}</p>
                    <p className="mt-2 text-xl font-bold text-gray-700">
                        Appointment Fee: <span className="text-green-600">${doctor.appointment_fee}</span>
                    </p>
                </div>
            </div>

            {/* --- Booking Form --- */}
            <form className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200" onSubmit={handleBookingSubmit}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Book Your Appointment</h2>

                {/* --- Messages --- */}
                {success && <p className="text-center text-green-600 bg-green-50 p-3 rounded-lg mb-4">{success}</p>}
                {error && <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* --- Calendar Section --- */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">1. Select a Date</h3>
                        <div className="p-2 bg-gray-100 rounded-lg inline-block">
                             <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime('');
                                }}
                                minDate={new Date()}
                                inline
                            />
                        </div>
                    </div>

                    {/* --- Time Slot Section --- */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">2. Select an Available Time</h3>
                        {availableTimeSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {availableTimeSlots.map((time) => {
                                    const isBooked = bookedSlots.includes(time);
                                    const now = new Date();
                                    const slotDateTime = new Date(selectedDate);
                                    const [hours, minutes] = time.split(':');
                                    slotDateTime.setHours(hours, minutes, 0, 0);
                                    const isPast = selectedDate.toDateString() === now.toDateString() && slotDateTime < now;
                                    const isDisabled = isBooked || isPast;

                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => !isDisabled && setSelectedTime(time)}
                                            disabled={isDisabled}
                                            className={`py-2 px-4 border rounded-md text-center font-semibold transition duration-200 
                                                ${selectedTime === time 
                                                    ? 'bg-cyan-500 text-white border-cyan-500' 
                                                    : isDisabled 
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through' 
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-cyan-50 hover:border-cyan-400'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">This doctor has not set their available hours.</p>
                        )}
                    </div>
                </div>

                {/* --- Confirmation Button --- */}
                <div className="mt-8 pt-6 border-t">
                     <button
                        type="submit"
                        className="w-full sm:w-auto float-right bg-green-500 text-white text-lg font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedTime || success}
                    >
                        Confirm Appointment
                    </button>
                </div>
            </form>
        </div>
    </div>
);}
export default Appointment;