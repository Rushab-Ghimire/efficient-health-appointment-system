// src/pages/VerificationPage.jsx

import React, { useState } from 'react';
import apiClient from '../api';

const VerificationPage = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Your handleVerify function is perfect.
  const handleVerify = async () => {
    // Prevent multiple clicks while loading
    if (isLoading) return;
    
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

  // Your handleCheckIn function is perfect.
  const handleCheckIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
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

  // --- THIS IS THE MISSING JSX ---
 return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-12 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-cyan-700">
          Appointment Verification & Check-In
        </h1>

        {/* --- Form Section --- */}
        <div className="space-y-2">
            <label htmlFor="appointmentId" className="block text-sm font-semibold text-gray-600">
                Enter or Scan Appointment ID:
            </label>
            <div className="flex gap-3">
                <input
                    id="appointmentId"
                    type="text"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    placeholder="e.g. 123"
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading && !appointmentDetails ? 'Verifying...' : 'Verify'}
                </button>
            </div>
        </div>

        {/* --- Messages Area --- */}
        <div className="h-6 text-center"> {/* A container to prevent layout shifts */}
            {error && <p className="text-red-600 font-medium">{error}</p>}
            {success && <p className="text-green-600 font-medium">{success}</p>}
        </div>

        {/* --- Appointment Details Section (conditionally rendered) --- */}
        {appointmentDetails && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Appointment Details</h2>
            
            <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <strong className="text-gray-600">Patient:</strong>
                <span className="font-medium text-gray-900">
                  {appointmentDetails.patient.first_name} {appointmentDetails.patient.last_name}   
                </span>
              </div>

              <div className="flex justify-between">
                <strong className="text-gray-600">Doctor:</strong>
                <span className="font-medium text-gray-900">
                  Dr. {appointmentDetails.doctor.full_name}
                </span>
              </div>

              <div className="flex justify-between">
                <strong className="text-gray-600">Date:</strong>
                <span className="font-medium text-gray-900">{appointmentDetails.date}</span>
              </div>

              <div className="flex justify-between">
                <strong className="text-gray-600">Time:</strong>
                <span className="font-medium text-gray-900">{appointmentDetails.time.slice(0,5)}</span>
              </div>

              <div className="flex justify-between items-center">
                <strong className="text-gray-600">Status:</strong> 
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                    appointmentDetails.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointmentDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                  {appointmentDetails.status.toUpperCase()}
                </span>
              </div>
              
            </div>
            
      

            {/* --- Check-In Button --- */}
            {appointmentDetails.status === 'scheduled' && (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full mt-6 bg-green-500 text-white text-lg font-bold py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Check-In Patient'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;