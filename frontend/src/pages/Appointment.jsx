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
         <div className='bg-gradient-to-b from-white via-indigo-50 to-blue-100 pb-20'>

      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-6 px-4 py-6'>
        {/* Image */}
        <div className='rounded-2xl overflow-hidden shadow-md bg-white border border-indigo-100 p-4'>
          <img
            className='bg-indigo-100 w-full px-3 py-2 max-w-[400px] h-auto object-cover rounded-xl'
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* Info */}
        <div className='flex-1 border border-indigo-200 rounded-2xl p-6 bg-white mt-[-60px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-bold text-slate-800'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="Verified" />
          </p>

          <div className='flex items-center gap-2 text-lg mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-1 px-3 text-sm font-semibold bg-indigo-100 text-cyan-800 rounded-full shadow-sm'>
              {docInfo.experience}
            </button>
          </div>

          {/* About */}
          <div>
            <p className='text-xl font-semibold text-slate-800 mt-4'>About:</p>
            <p className='text-[17px] text-gray-600 mt-1 px-1 py-3'>{docInfo.about}</p>
          </div>

          <p className='text-slate-800 font-semibold mt-4 text-lg'>
            Appointment fee: <span className='text-black font-bold'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>
        <p className='text-3xl font-bold text-black border-b-2 border-indigo-200 inline-block pb-1'>
          Booking Slots
        </p>

        {/* Date Picker */}
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 scrollbar-hide'>
          {docSlots.length && docSlots.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center text-lg font-medium px-5 py-4 min-w-20 rounded-xl cursor-pointer transition duration-300 ${
                slotIndex === index
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-white border border-indigo-100 shadow-sm'
              }`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 pb-2 scrollbar-hide'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition duration-300 ${
                item.time === slotTime
                  ? 'bg-green-500 text-white'
                  : 'text-white border border-indigo-300 bg-white'
              }`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        {/* Book Button */}
        <button className='bg-gradient-to-r from-green-400 to-green-600 shadow-md text-white text-xl px-8 py-4 rounded-full mt-6 hover:scale-105 transition duration-300'>
          Book an Appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;