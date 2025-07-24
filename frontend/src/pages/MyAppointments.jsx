// src/pages/MyAppointments.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import apiClient from '../api';
import { Link } from 'react-router-dom'; // <-- ADD THIS LINE


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);

  // NEW: Add filter state
  const [filters, setFilters] = useState({
    status: 'all',
    date_filter: 'all'
  });
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiClient.get('/api/appointments/')
        .then(response => {
          setAppointments(response.data);
          setFilteredAppointments(response.data); // NEW: Initialize filtered appointments
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
      // --- THIS IS THE FIX ---
      // Add the '/api/' prefix to match your Django URL configuration.
      await apiClient.post('/api/auth/create-session/');
      
      // The rest of your logic is perfect.
      const receiptUrl = `http://127.0.0.1:8000/api/receipt/${appointmentId}/`;
      window.open(receiptUrl, '_blank', 'noopener,noreferrer');

    } catch (error) {
        console.error("Could not create session for receipt view:", error);
        alert("There was an error generating the receipt. Please try again.");
    }
  };

  // NEW: Filter functions
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    fetchFilteredAppointments(newFilters);
  };

  const fetchFilteredAppointments = async (currentFilters) => {
    try {
      const params = new URLSearchParams();
      if (currentFilters.status !== 'all') {
        params.append('status', currentFilters.status);
      }
      if (currentFilters.date_filter !== 'all') {
        params.append('date_filter', currentFilters.date_filter);
      }

      const response = await apiClient.get(`/api/appointments/filter_appointments/?${params}`);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error filtering appointments:', error);
    }
  };

  // NEW: Filter component
  const AppointmentFilters = () => {
    const statusOptions = [
      { value: 'all', label: 'All' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'no_show', label: 'No Show' }
    ];

    const dateOptions = [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'past', label: 'Past' }
    ];

    return (
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('status', option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.status === option.value
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Date</h3>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('date_filter', option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.date_filter === option.value
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='px-4 sm:px-10 py-8 min-h-screen'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      
      {/* NEW: Add the filter component */}
      <AppointmentFilters />
      
      <div>
        {/* CHANGED: Use filteredAppointments instead of appointments */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
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

                 {/* This button only appears if the appointment is 'scheduled' and not in the past */}
                  {appointment.status === 'scheduled' && !appointment.is_past && (
                      <Link 
                          to={`/map?start=Main%20Gate&destination=${encodeURIComponent(appointment.doctor_building)}&ward=${encodeURIComponent(appointment.specialization)}`}
                          className='text-sm text-stone-600 font-medium text-center sm:min-w-48 py-2 px-4 border border-gray-300 rounded-md bg-blue-100 hover:bg-blue-500 hover:text-white transition-all duration-300'
                    >
                        Navigate to Appointment
                    </Link>
                  )}               
                
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-zinc-500 py-10'>No appointments found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;