import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import { assets } from '../assets/assets';
import apiClient from '../api'; // Your centralized API client

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    // This can be used for things like currency, but user/token comes from context now
    const { token } = useContext(AppContext);
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    
    // State to hold the selected date and time in the correct format for the backend
    const [selectedDate, setSelectedDate] = useState(''); // e.g., "2025-07-15"
    const [selectedTime, setSelectedTime] = useState(''); // e.g., "10:30:00"

    // --- 1. Fetch Doctor Info from the API ---
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (docId) {
                try {
                    // Assuming your doctors endpoint is /api/doctors/<id>/
                    const response = await apiClient.get(`/doctors/${docId}/`);
                    setDocInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch doctor details:", error);
                    navigate('/doctors'); // Redirect if doctor not found
                }
            }
        };
        fetchDoctorDetails();
    }, [docId, navigate]);

    // --- 2. Generate Time Slots (this logic can be improved later) ---
    // Note: A better approach is to fetch available slots from the backend.
    // For now, we will keep your client-side generation logic.
    useEffect(() => {
        if (!docInfo) return;

        const getAvailableSlots = () => {
            const slotsByDay = [];
            const today = new Date();

            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);

                const daySlots = [];
                // Example: Generate slots from 9:00 AM to 5:00 PM (17:00)
                let slotTime = new Date(currentDate.setHours(9, 0, 0, 0));
                const endTime = new Date(currentDate.setHours(17, 0, 0, 0));

                while (slotTime < endTime) {
                    daySlots.push(new Date(slotTime));
                    slotTime.setMinutes(slotTime.getMinutes() + 30);
                }
                slotsByDay.push(daySlots);
            }
            setDocSlots(slotsByDay);
        };
        getAvailableSlots();
    }, [docInfo]);
    
    // --- 3. Handle Slot Selection ---
    const handleSlotSelection = (dateObject) => {
        // Format for backend: YYYY-MM-DD
        const formattedDate = dateObject.toISOString().split('T')[0];
        // Format for backend: HH:MM:SS
        const formattedTime = dateObject.toLocaleTimeString('en-GB'); // en-GB gives 24-hour format HH:mm:ss

        setSelectedDate(formattedDate);
        setSelectedTime(formattedTime);
    };
    
    // --- 4. Handle the Booking Submission ---
    const handleBooking = async () => {
        if (!token) {
            alert("Please log in to book an appointment.");
            navigate('/login');
            return;
        }
        if (!selectedDate || !selectedTime) {
            alert("Please select a date and a time slot.");
            return;
        }

        const bookingData = {
            doctor_id: parseInt(docId), // Ensure docId is an integer
            date: selectedDate,
            time: selectedTime,
        };

        try {
            const response = await apiClient.post('/appointments/', bookingData);
            console.log('Booking successful:', response.data);
            alert('Your appointment has been booked successfully! You will receive an SMS confirmation.');
            navigate('/my-appointments'); // Redirect after successful booking
        } catch (error) {
            console.error('Booking failed:', error.response ? error.response.data : error.message);
            alert(`Booking failed: ${JSON.stringify(error.response?.data) || "An unknown error occurred."}`);
        }
    };
    
    // Show a loading state while fetching doctor info
    if (!docInfo) {
        return <div>Loading doctor details...</div>;
    }

    return (
        <div>
            {/* ---------Doctor Details -----------*/}
            <div className='flex flex-col sm:flex-row gap-4 px-2 py-5'>
                {/* ... your existing JSX for doctor details ... */}
            </div>

            {/* -------- Booking slots ------ */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p className='text-3xl font-bold text-blue-700 border-b-2 border-blue-200 inline-block pb-1'>
                    Available Slots
                </p>

                {/* Day Selection */}
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.map((day, index) => (
                        day.length > 0 && (
                            <div
                                onClick={() => setSlotIndex(index)}
                                className={`text-center text-2xl py-6 min-w-19 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-800'}`}
                                key={index}
                            >
                                <p>{daysOfWeek[day[0].getDay()]}</p>
                                <p>{day[0].getDate()}</p>
                            </div>
                        )
                    ))}
                </div>

                {/* Time Slot Selection */}
                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4'>
                    {docSlots[slotIndex]?.map((dateObj, index) => {
                        const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const backendTimeString = dateObj.toLocaleTimeString('en-GB');
                        
                        return (
                            <p
                                onClick={() => handleSlotSelection(dateObj)}
                                className={`text-sm font-light text-center px-5 py-2 rounded-full cursor-pointer ${backendTimeString === selectedTime ? 'bg-cyan-400 text-black' : 'text-gray-800 border border-black'}`}
                                key={index}
                            >
                                {timeString}
                            </p>
                        )
                    })}
                </div>

                {/* --- The Corrected Button --- */}
                <button
                    onClick={handleBooking}
                    className='bg-blue-600 shadow-sm text-2xl text-white px-9 py-6 rounded-full my-6 disabled:bg-gray-400'
                    disabled={!selectedTime} // Disable button until a slot is selected
                >
                    Book Appointment
                </button>
            </div>

            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;