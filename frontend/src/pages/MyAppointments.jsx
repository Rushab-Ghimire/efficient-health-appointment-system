import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import apiClient from '../api';

const MyAppointments = () => {
  // --- CHANGE 1: State for Appointments ---
  // This component will manage its own list of appointments.
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // We still need the user from context to know if we should fetch data.
  const { user } = useContext(AppContext);

  // --- CHANGE 2: Fetching Appointment Data ---
  // This effect runs when the component mounts or when the user logs in/out.
  useEffect(() => {
    // Only fetch appointments if the user is logged in.
    if (user) {
      setLoading(true);
      apiClient.get('/appointments/')
        .then(response => {
          // The data from the API is an array of appointments.
          setAppointments(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Could not fetch appointments:", error);
          setError("Failed to load appointments.");
          setLoading(false);
        });
    }
  }, [user]); // The dependency array ensures this runs when the user object is available.

  // --- CHANGE 3: Cancel Appointment Functionality ---
  const handleCancel = async (appointmentId) => {
    // Ask for confirmation before cancelling
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        // This hits the POST /api/appointments/{id}/cancel/ endpoint
        await apiClient.post(`/appointments/${appointmentId}/cancel/`);
        
        // To update the UI, we can filter out the cancelled appointment from our state
        setAppointments(currentAppointments => 
          currentAppointments.filter(app => app.id !== appointmentId)
        );
        alert("Appointment cancelled successfully.");
      } catch (error) {
        console.error("Failed to cancel appointment:", error.response.data);
        alert(`Error: ${error.response.data.error || 'Could not cancel appointment.'}`);
      }
    }
  };


  // --- UI Loading and Error States ---
  if (loading) {
    return <div className='px-10 py-8'>Loading your appointments...</div>;
  }

  if (error) {
    return <div className='px-10 py-8 text-red-500'>{error}</div>;
  }

  return (
    <div className='px-4 sm:px-10 py-8 bg-gradient-to-b from-white via-indigo-50 to-blue-100 min-h-screen'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      
      {/* --- CHANGE 4: Looping over Appointments --- */}
      <div>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            // Use appointment.id for a unique and stable key
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={appointment.id}>
              {/* Note: The doctor's image is not in the AppointmentListSerializer. We can omit it for now. */}
              {/* <div className='w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500'>No Image</div> */}
              
              <div className='flex-1 text-sm text-zinc-600 col-span-2 sm:col-span-1'>
                <p className='text-neutral-800 font-semibold text-lg'>Dr. {appointment.doctor_name}</p>
                <p>{appointment.specialization}</p>
                <p className='mt-2'>
                  <span className='text-neutral-700 font-medium'>Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${appointment.status === 'scheduled' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                    {appointment.status}
                  </span>
                </p>
                <p className='text-md mt-2'>
                    <span className='text-neutral-700 font-medium'>Date & Time:</span> 
                    {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time.slice(0, 5)}
                </p>
              </div>

              <div className='flex flex-col gap-2 justify-end col-span-full sm:col-span-1 sm:ml-auto'>
                <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-cyan-500 hover:text-white transition-all duration-300'>
                  View Receipt
                </button>
                
                {/* Only show the cancel button for upcoming, scheduled appointments */}
                {appointment.status === 'scheduled' && !appointment.is_past && (
                   <button 
                     onClick={() => handleCancel(appointment.id)}
                     className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-500 hover:text-white transition-all duration-300'>
                     Cancel appointment
                   </button>
                )}
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