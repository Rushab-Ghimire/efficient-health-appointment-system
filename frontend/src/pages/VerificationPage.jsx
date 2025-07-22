// src/pages/VerificationPage.jsx

import React, { useState } from 'react';
import apiClient from '../api'; // <-- 1. Import your apiClient

const VerificationPage = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    setAppointmentDetails(null);

    if (!appointmentId.trim()) {
      setError('Please enter an appointment ID.');
      setIsLoading(false);
      return;
    }

    try {
      // --- 2. Use apiClient for the GET request ---
      // The auth token is added automatically by the interceptor.
      const response = await apiClient.get(`/api/appointments/${appointmentId}/`);
      
      setAppointmentDetails(response.data);

    } catch (err) {
      if (err.response?.status === 404) {
        setError('No appointment found with this ID.');
      } else {
        setError('An unexpected error occurred while verifying.');
      }
      console.error("Verification failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // --- 3. Use apiClient for the POST request ---
      await apiClient.post(`/api/appointments/${appointmentId}/complete/`);
      
      setSuccess('Patient Checked-In Successfully!');
      // Refresh the details to show the updated "completed" status.
      await handleVerify();

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to check in. Please try again.';
      setError(errorMessage);
      console.error("Check-in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Your JSX is already excellent and needs no changes ---
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 px-4">
      {/* ... Your existing, well-structured JSX ... */}
    </div>
  );
};

export default VerificationPage;