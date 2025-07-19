import React, { useState } from 'react';

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

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAppointmentDetails(data);
      } else if (res.status === 404) {
        setError('No appointment found with this ID.');
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/login';
      } else {
        setError('An unexpected error occurred.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/complete/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        setSuccess('Patient Checked-In Successfully!');
        await handleVerify(); // Refresh status
      } else {
        setError('Failed to check in. Please try again.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-xl p-6">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Appointment Verification & Check-In
        </h2>

        {/* Input Field */}
        <label className="font-semibold mb-1 block">Enter or Scan Appointment ID:</label>
        <input
          type="text"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          placeholder="e.g. appt_123456"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Verify
        </button>

        {/* Messages */}
        {isLoading && <p className="mt-4 text-gray-600">Verifying...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}

        {/* Appointment Details */}
        {appointmentDetails && (
          <div className="mt-6 border border-gray-200 rounded-lg bg-gray-50 p-4">
            <h3 className="text-lg font-bold mb-3 text-gray-700">Appointment Details</h3>
            <p><span className="font-medium">Patient:</span> {appointmentDetails.patient.first_name} {appointmentDetails.patient.last_name}</p>
            <p><span className="font-medium">Doctor:</span> {appointmentDetails.doctor.full_name}</p>
            <p><span className="font-medium">Time:</span> {appointmentDetails.time}</p>
            <p><span className="font-medium">Status:</span> {appointmentDetails.status.toUpperCase()}</p>

            {/* QR Code */}
            {appointmentDetails.qr_code_url && (
              <div className="text-center mt-4">
                <p className="font-medium mb-2">QR Code:</p>
                <img
                  src={appointmentDetails.qr_code_url}
                  alt="QR Code"
                  className="mx-auto border border-gray-300 rounded-md p-2"
                />
              </div>
            )}

            {/* Check-In Button */}
            {appointmentDetails.status.toLowerCase() === 'scheduled' && (
              <button
                onClick={handleCheckIn}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Check-In Patient
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
