import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; // Make sure you have your API client utility

const TopDoctors = () => {
    const navigate = useNavigate();
    
    // 1. Add state specifically for this component's data
    const [topDoctors, setTopDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Add useEffect to fetch data when the component mounts
    useEffect(() => {
        const fetchTopDoctors = async () => {
            try {
                // 3. Call the NEW top-rated endpoint with a limit
                const response = await apiClient.get('/api/doctors/top-rated/?limit=5');
                setTopDoctors(response.data);
            } catch (err) {
                console.error("Failed to fetch top doctors:", err);
                setError("Could not load top doctors.");
            } finally {
                setLoading(false);
            }
        };

        fetchTopDoctors();
    }, []); // The empty array [] means this runs only once when the component first renders

    // Handle loading state
    if (loading) {
        return <div className="text-center p-10">Loading top doctors...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-center p-10 text-red-600">{error}</div>;
    }

    return (
        <div className='flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-5xl font-extrabold text-cyan-800 tracking-tight'>Meet Our Top Doctors</h1>
            <p className='sm:w-2/3 text-center text-2xl text-gray-900 leading-relaxed'>
                Discover a team of compassionate and highly skilled doctors committed to your health and well-being.
                Browse profiles and book your appointment instantly with just a click.
            </p>

            <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 pt-10'>
                {/* 4. Map over the new 'topDoctors' state variable */}
                {topDoctors.map((doctor) => (
                    <div
                        onClick={() => navigate(`/appointment/${doctor.id}`)}
                        className='bg-white border border-blue-100 rounded-3xl shadow-md hover:shadow-xl cursor-pointer hover:-translate-y-1 transform transition-all duration-300 overflow-hidden'
                        key={doctor.id}
                    >
                        <div className='aspect-[4/3] w-full bg-blue-50'>
                            {/* Use a placeholder if the image is missing */}
                            <img
                                className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300'
                                src={doctor.image || '/default-doctor-avatar.png'} // Add a fallback image
                                alt={doctor.full_name}
                            />
                        </div>

                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-green-600 mb-1'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                <span className='font-medium'>Available</span>
                            </div>
                            <p className='text-lg font-semibold text-gray-800'>Dr. {doctor.full_name}</p>
                            <p className='text-sm text-blue-600'>{doctor.specialization}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
                className='bg-green-400 text-white font-semibold px-10 py-3 rounded-full mt-10 hover:bg-blue-700 hover:shadow-lg transition duration-300'
            >
                View All Doctors
            </button>
        </div>
    );
};

export default TopDoctors;