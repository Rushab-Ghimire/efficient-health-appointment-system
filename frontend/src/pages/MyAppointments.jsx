// src/pages/MyAppointments.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import apiClient from '../api';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiClient.get('/appointments/')
        .then(response => {
          setAppointments(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Could not fetch appointments:", error);
          setError("Failed to load appointments.");
          setLoading(false);
        });
    }
  }, [user]);

  // --- THIS IS THE NEW FUNCTION ---
  const handleViewReceipt = async (appointmentId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("You must be logged in to view a receipt.");
        return;
    }
    try {
      // Step 1: Call our new endpoint to create a session cookie.
      await apiClient.post('/auth/create-session/');
      
      // Step 2: Once the session is created, build the full URL to the receipt.
      const receiptUrl = `http://127.0.0.1:8000/api/receipt/${appointmentId}/`;
      
      // Step 3: Open the URL in a new tab. The browser will now send the
      // session cookie, and Django's @login_required will work!
      window.open(receiptUrl, '_blank', 'noopener,noreferrer');

    } catch (error) {
        console.error("Could not create session for receipt view:", error);
        alert("There was an error generating the receipt. Please try again.");
    }
  };


  if (loading) {
    return <div className='px-10 py-8'>Loading your appointments...</div>;
  }
  if (error) {
    return <div className='px-10 py-8 text-red-500'>{error}</div>;
  }

  return (
    <div className='px-4 sm:px-10 py-8 min-h-screen'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div className='sm:flex items-center justify-between py-4 border-b' key={appointment.id}>
              {/* Appointment Info */}
              <div>
                <p className='text-neutral-800 font-bold text-xl'>Dr. {appointment.doctor_name}</p>
                <p className='text-gray-600'>{appointment.specialization}</p>
                <p className='mt-2'>
                  <span className='text-neutral-700 font-medium'>Status:</span>
                  <span className='ml-2 px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800'>{appointment.status}</span>
                </p>
                <p className='text-md mt-1'>
                  <span className='text-neutral-700 font-medium'>Date & Time:</span> 
                  {new Date(appointment.date + 'T' + appointment.time).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-2 mt-4 sm:mt-0'>
                {/* --- UPDATE THIS BUTTON --- */}
                <button 
                  onClick={() => handleViewReceipt(appointment.id)}
                  className='text-sm text-stone-600 font-medium text-center sm:min-w-48 py-2 px-4 border border-gray-300 rounded-md hover:bg-cyan-500 hover:text-white transition-all duration-300'
                >
                  View Receipt
                </button>
                
                
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-zinc-500 py-10'>You have no appointments scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;