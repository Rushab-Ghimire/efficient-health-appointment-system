import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import { assets } from '../assets/assets';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  const filteredSlots = docSlots.find(
    (slots) =>
      slots.length &&
      new Date(slots[0].datetime).toDateString() === selectedDate.toDateString()
  );

  return (
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
};

export default Appointment;
