// src/pages/VerificationPage.jsx

import React, { useState } from 'react';
import apiClient from '../api';
import { Search, CheckCircle, Clock, User, Calendar, Stethoscope, AlertCircle, UserCheck, QrCode } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Professional Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointment Verification</h1>
                <p className="text-gray-600">Verify patient appointments and manage check-ins efficiently</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="px-8 py-6">
            <div className="max-w-2xl">
              <label htmlFor="appointmentId" className="block text-sm font-semibold text-gray-700 mb-3">
                Appointment ID
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <QrCode className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="appointmentId"
                    type="text"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    placeholder="Enter appointment ID (e.g., 123)"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && !appointmentDetails ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="-ml-1 mr-2 h-4 w-4" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Appointment Details */}
        {appointmentDetails && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  appointmentDetails.status === 'scheduled' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : appointmentDetails.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {appointmentDetails.status === 'completed' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {appointmentDetails.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Patient Information */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Patient</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {appointmentDetails.patient.first_name} {appointmentDetails.patient.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Doctor</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        Dr. {appointmentDetails.doctor.full_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{appointmentDetails.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Time</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{appointmentDetails.time.slice(0,5)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Check-in Button */}
              {appointmentDetails.status === 'scheduled' && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex justify-center">
                    <button
                      onClick={handleCheckIn}
                      disabled={isLoading}
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing Check-in...
                        </>
                      ) : (
                        <>
                          <UserCheck className="-ml-1 mr-3 h-5 w-5" />
                          Check-in Patient
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;