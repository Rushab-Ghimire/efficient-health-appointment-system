// src/components/AIDoctorFinder.jsx

import React, { useState } from 'react';
import apiClient from '../api'; // Your pre-configured axios instance

const AIDoctorFinder = () => {
  // State to hold the user's input
  const [issue, setIssue] = useState('');
  
  // State to hold the list of recommended doctors from the API
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  
  // State to manage loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State to know if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    
    if (!issue.trim()) {
      setError('Please describe your medical issue.');
      return;
    }
    
    setLoading(true);
    setError('');
    setHasSearched(true); // Mark that a search has been attempted
    setRecommendedDoctors([]); // Clear previous results

    try {
      // --- This is the API call to your new Django endpoint ---
      const response = await apiClient.post('/recommend-doctor-ai/', {
        issue: issue
      });
      setRecommendedDoctors(response.data.recommendations);
    } catch (err) {
      setError('An error occurred while fetching recommendations. Please try again.');
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4'>
      <div className='w-full max-w-4xl'>
        {/* --- Search Form Section --- */}
        <div className='bg-white p-8 rounded-xl shadow-md border border-gray-200'>
          <h1 className='text-3xl font-bold text-cyan-700 text-center mb-2'>
            AI-Powered Doctor Finder
          </h1>
          <p className='text-center text-gray-600 mb-6'>
            Describe your symptoms, and our AI will recommend the right specialists for you.
          </p>
          <form onSubmit={handleSearch}>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g., 'I have a sharp pain in my chest when I breathe deeply' or 'For the last month, my stomach hurts after every meal'..."
              className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
              rows="4"
            />
            <button
              type="submit"
              disabled={loading}
              className='w-full mt-4 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300'
            >
              {loading ? 'Searching...' : 'Find a Doctor'}
            </button>
          </form>
        </div>

        {/* --- Results Section --- */}
        <div className='mt-8'>
          {error && <p className="text-center text-red-500">{error}</p>}
          
          {loading && <p className="text-center text-gray-600">Finding the best doctors for you...</p>}

          {!loading && hasSearched && (
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>Recommendations</h2>
              {recommendedDoctors.length > 0 ? (
                <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                  <table className='w-full text-left'>
                    <thead className='bg-gray-100'>
                      <tr>
                        <th className='p-4 font-semibold text-gray-700'>Doctor Name</th>
                        <th className='p-4 font-semibold text-gray-700'>Specialization</th>
                        <th className='p-4 font-semibold text-gray-700'>Available Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendedDoctors.map((doctor) => (
                        <tr key={doctor.id} className='border-t border-gray-200'>
                          <td className='p-4'>Dr. {doctor.full_name}</td>
                          <td className='p-4'>{doctor.specialization}</td>
                          <td className='p-4'>{doctor.available_from.slice(0, 5)} - {doctor.available_to.slice(0, 5)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='text-center bg-white p-8 rounded-xl shadow-md'>
                  <p className='text-gray-600'>No doctors found matching your description. Please try being more specific or check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDoctorFinder;