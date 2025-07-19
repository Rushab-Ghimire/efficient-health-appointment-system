// frontend/src/pages/Appointment.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import { assets } from '../assets/assets';
<<<<<<< HEAD
import apiClient from '../api';

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    
    const [docInfo, setDocInfo] = useState(null);
    const [slotsByDay, setSlotsByDay] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const [selectedDate, setSelectedDate] = useState(''); // e.g., "2025-07-15"
    const [selectedTime, setSelectedTime] = useState(''); // e.g., "10:30" (HH:MM)

    // --- 1. Fetch Doctor Info from the API ---
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (docId) {
                try {
                    const response = await apiClient.get(`/doctors/${docId}/`);
                    setDocInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch doctor details:", error);
                    navigate('/doctors');
                }
            }
        };
        fetchDoctorDetails();
    }, [docId, navigate]);

    // --- 2. Generate Client-Side Time Slots ---
    useEffect(() => {
        if (!docInfo) return;

        const generatedSlots = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            const times = [];
            // Use doctor's actual availability from the API
            const [startHour] = docInfo.available_from.split(':').map(Number);
            const [endHour] = docInfo.available_to.split(':').map(Number);

            for (let hour = startHour; hour < endHour; hour++) {
                times.push(`${String(hour).padStart(2, '0')}:00`);
                times.push(`${String(hour).padStart(2, '0')}:30`);
            }
            generatedSlots.push({ day, times });
        }
        setSlotsByDay(generatedSlots);
        
        // Pre-select the first day
        if(generatedSlots.length > 0) {
            setSelectedDate(generatedSlots[0].day.toISOString().split('T')[0]);
        }

    }, [docInfo]);

    // --- 3. Handle Slot Selection ---
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleDaySelect = (index) => {
        setSelectedDayIndex(index);
        const selectedDayObject = slotsByDay[index].day;
        setSelectedDate(selectedDayObject.toISOString().split('T')[0]);
        setSelectedTime(''); // Reset time selection when day changes
    };

    // --- 4. Handle the Booking Submission ---
    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select a date and a time slot.");
            return;
        }

        const bookingData = {
            doctor_id: parseInt(docId),
            date: selectedDate,
            time: selectedTime,
        };

        try {
            await apiClient.post('/appointments/', bookingData);
            alert('Your appointment has been booked successfully!');
            navigate('/my-appointments');
        } catch (error) {
            console.error('Booking failed:', error.response?.data || error.message);
            alert(`Booking failed: ${JSON.stringify(error.response?.data) || "An unknown error occurred."}`);
        }
    };
    
    if (!docInfo) {
        return <div className="text-center py-20">Loading doctor details...</div>;
=======
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api'; // Your centralized API client

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotTime, setSlotTime] = useState('');

    
 const fetchDocInfo = () => {
    const info = doctors.find(doc => doc._id === docId);
    setDocInfo(info);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9 PM

      if (i === 0) {
        startTime.setHours(Math.max(today.getHours() + 1, 10));
        startTime.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        startTime.setHours(10, 0, 0, 0); // Start at 10:00 AM
      }

      let slots = [];
      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        slots.push({
          datetime: new Date(startTime),
          time: formattedTime,
        });

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, slots]);
>>>>>>> 63cd364 (Added frontend code)
    }
  };

    // // --- 1. Fetch Doctor Info from the API ---
    // useEffect(() => {
    //     const fetchDoctorDetails = async () => {
    //         if (docId) {
    //             try {
    //                 // Assuming your doctors endpoint is /api/doctors/<id>/
    //                 const response = await apiClient.get(`/doctors/${docId}/`);
    //                 setDocInfo(response.data);
    //             } catch (error) {
    //                 console.error("Failed to fetch doctor details:", error);
    //                 navigate('/doctors'); // Redirect if doctor not found
    //             }
    //         }
    //     };
    //     fetchDoctorDetails();
    // }, [docId, navigate]);

    // // --- 2. Generate Time Slots (this logic can be improved later) ---
    // // Note: A better approach is to fetch available slots from the backend.
    // // For now, we will keep your client-side generation logic.
    // useEffect(() => {
    //     if (!docInfo) return;

    //     const getAvailableSlots = () => {
    //         const slotsByDay = [];
    //         const today = new Date();

    //         for (let i = 0; i < 7; i++) {
    //             const currentDate = new Date(today);
    //             currentDate.setDate(today.getDate() + i);

    //             const daySlots = [];
    //             // Example: Generate slots from 9:00 AM to 5:00 PM (17:00)
    //             let slotTime = new Date(currentDate.setHours(9, 0, 0, 0));
    //             const endTime = new Date(currentDate.setHours(17, 0, 0, 0));

    //             while (slotTime < endTime) {
    //                 daySlots.push(new Date(slotTime));
    //                 slotTime.setMinutes(slotTime.getMinutes() + 30);
    //             }
    //             slotsByDay.push(daySlots);
    //         }
    //         setDocSlots(slotsByDay);
    //     };
    //     getAvailableSlots();
    // }, [docInfo]);
    
    // // --- 3. Handle Slot Selection ---
    // const handleSlotSelection = (dateObject) => {
    //     // Format for backend: YYYY-MM-DD
    //     const formattedDate = dateObject.toISOString().split('T')[0];
    //     // Format for backend: HH:MM:SS
    //     const formattedTime = dateObject.toLocaleTimeString('en-GB'); // en-GB gives 24-hour format HH:mm:ss

    //     setSelectedDate(formattedDate);
    //     setSelectedTime(formattedTime);
    // };
    
    // // --- 4. Handle the Booking Submission ---
    // const handleBooking = async () => {
    //     if (!token) {
    //         alert("Please log in to book an appointment.");
    //         navigate('/login');
    //         return;
    //     }
    //     if (!selectedDate || !selectedTime) {
    //         alert("Please select a date and a time slot.");
    //         return;
    //     }

    //     const bookingData = {
    //         doctor_id: parseInt(docId), // Ensure docId is an integer
    //         date: selectedDate,
    //         time: selectedTime,
    //     };

    //     try {
    //         const response = await apiClient.post('/appointments/', bookingData);
    //         console.log('Booking successful:', response.data);
    //         alert('Your appointment has been booked successfully! You will receive an SMS confirmation.');
    //         navigate('/my-appointments'); // Redirect after successful booking
    //     } catch (error) {
    //         console.error('Booking failed:', error.response ? error.response.data : error.message);
    //         alert(`Booking failed: ${JSON.stringify(error.response?.data) || "An unknown error occurred."}`);
    //     }
    // };
    
    // // Show a loading state while fetching doctor info
    // if (!docInfo) {
    //     return <div>Loading doctor details...</div>;
    // }

    return (
<<<<<<< HEAD
        <div className='bg-gradient-to-b from-white via-indigo-50 to-blue-100 pb-20'>
            {/* Doctor Details Section */}
            <div className='flex flex-col sm:flex-row gap-6 px-4 py-6 sm:px-10'>
                <div className='rounded-2xl overflow-hidden shadow-md bg-white border border-indigo-100 p-4'>
                    <img className='bg-indigo-100 w-full max-w-[400px] h-auto object-cover rounded-xl' src={docInfo.image || assets.default_doctor_image} alt={docInfo.full_name} />
                </div>
                <div className='flex-1 border border-indigo-200 rounded-2xl p-6 bg-white'>
                    <p className='flex items-center gap-2 text-2xl font-bold text-slate-800'>{docInfo.full_name}<img className='w-5' src={assets.verified_icon} alt="Verified" /></p>
                    <p className='text-lg mt-1 text-gray-600'>{docInfo.specialization}</p>
                    <div className='mt-4'>
                        <p className='text-xl font-semibold text-slate-800'>About:</p>
                        <p className='text-gray-600 mt-1'>Dr. {docInfo.full_name} specializes in {docInfo.specialization} with a patient-first approach.</p>
                    </div>
                    <p className='text-slate-800 font-semibold mt-4 text-lg'>Appointment fee: <span className='text-black font-bold'>Rs.{docInfo.appointment_fee}</span></p>
                </div>
            </div>

            {/* Booking Slots Section */}
            <div className='px-4 sm:px-10 mt-6'>
                <p className='text-3xl font-bold text-black border-b-2 border-indigo-200 inline-block pb-1'>Booking Slots</p>
                {/* Date Picker */}
                <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 scrollbar-hide'>
                    {slotsByDay.map((slotGroup, index) => (
                        <div onClick={() => handleDaySelect(index)} className={`text-center text-lg font-medium px-5 py-4 min-w-[80px] rounded-xl cursor-pointer transition duration-300 ${selectedDayIndex === index ? 'bg-cyan-500 text-white' : 'bg-white text-gray-700 border'}`} key={index}>
                            <p>{slotGroup.day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p>{slotGroup.day.getDate()}</p>
                        </div>
                    ))}
                </div>
                {/* Time Slots */}
                <div className='grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4'>
                    {slotsByDay[selectedDayIndex]?.times.map((time, index) => (
                        <p onClick={() => handleTimeSelect(time)} className={`text-sm font-medium text-center px-5 py-2 rounded-full cursor-pointer transition duration-300 ${selectedTime === time ? 'bg-cyan-500 text-white' : 'bg-white text-gray-700 border'}`} key={index}>
                            {time}
                        </p>
                    ))}
                </div>
                <button onClick={handleBooking} className='bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md text-white text-xl px-8 py-4 rounded-full mt-8 hover:scale-105 transition duration-300'>Book an Appointment</button>
            </div>

            {/* Related Doctors */}
            {docInfo.specialization && <RelatedDoctors docId={docId} speciality={docInfo.specialization} />}
        </div>
    );
=======
    docInfo && (
      <div className='bg-gradient-to-b from-white via-indigo-50 to-blue-100 pb-20'>

        {/* Doctor Info */}
        <div className='flex flex-col sm:flex-row gap-6 px-4 py-6'>
          <div className='rounded-2xl overflow-hidden shadow-md bg-white border border-indigo-100 p-4'>
            <img
              className='bg-indigo-100 w-full px-3 py-2 max-w-[400px] h-auto object-cover rounded-xl'
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className='flex-1 border border-indigo-200 rounded-2xl p-6 bg-white mt-[-60px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-bold text-slate-800'>
              {docInfo.name}
              <img className='w-5' src={assets.verified_icon} alt="Verified" />
            </p>
            <div className='flex items-center gap-2 text-lg mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-1 px-3 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-full shadow-sm'>
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className='text-xl font-semibold text-slate-800 mt-4'>About:</p>
              <p className='text-[17px] text-gray-600 mt-1 px-1 py-3'>{docInfo.about}</p>
            </div>
            <p className='text-slate-800 font-semibold mt-4 text-lg'>
              Appointment fee: <span className='text-indigo-700 font-bold'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className='sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700'>

          <p className='text-3xl font-bold text-indigo-700 border-b-2 border-indigo-200 inline-block pb-1'>
            Book Appointment
          </p>

          {/* Calendar Date Picker */}
          <div className='mt-6'>
            <p className='text-lg font-semibold text-gray-700 mb-2'>Select a Date:</p>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSlotTime('');
              }}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
              className='border border-indigo-300 px-4 py-2 rounded-md bg-white'
              calendarClassName='bg-white border border-indigo-200'
            />
          </div>

          {/* Time Slots Dropdown */}
          <div className='mt-6 max-w-sm'>
            <p className='text-lg font-semibold text-gray-700 mb-2'>Available Time Slots:</p>
            {filteredSlots && filteredSlots.length > 0 ? (
              <>
                <select
                  className='w-full px-4 py-2 border border-indigo-300 rounded-md bg-white text-gray-700'
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                >
                  <option value="">-- Select a Time --</option>
                  {filteredSlots.map((item, index) => (
                    <option key={index} value={item.time}>
                      {item.time}
                    </option>
                  ))}
                </select>

                {slotTime && (
                  <p className='mt-2 text-indigo-600 font-semibold'>
                    Selected Time: {slotTime}
                  </p>
                )}
              </>
            ) : (
              <p className='text-red-500'>No slots available for this day.</p>
            )}
          </div>

          {/* Book Button */}
          <button
            className='bg-gradient-to-r from-indigo-500 to-blue-600 shadow-md text-white text-xl px-8 py-4 rounded-full mt-6 hover:scale-105 transition duration-300 disabled:opacity-50'
            disabled={!slotTime}
          >
            Book an Appointment
          </button>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
>>>>>>> 63cd364 (Added frontend code)
};

export default Appointment;
