import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import apiClient from '../api';

const Doctors = () => {
    const { speciality } = useParams();
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        if (doctors.length > 0) {
            if (speciality) {
                setFilteredDoctors(doctors.filter(doc => doc.specialization === speciality));
            } else {
                setFilteredDoctors(doctors);
            }
        }
    }, [doctors, speciality]);

    const specialitiesList = [
        "General physician", "Gynecologist", "Dermatologist", 
        "Pediatricians", "Neurologist", "Gastroenterologist", "Cardiology" // Added Cardiology
    ];

    return (
        <div className='px-4 sm:px-10 py-6'>
            <p className='text-gray-600 text-lg mb-4'>Browse through our specialists.</p>
            <SearchBar />
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* Sidebar with Specialities */}
                <div className='hidden sm:flex flex-col gap-2 w-full sm:w-60'>
                    {specialitiesList.map(spec => (
                        <p
                            key={spec}
                            onClick={() => navigate(speciality === spec ? '/doctors' : `/doctors/${spec}`)}
                            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === spec ? 'bg-indigo-100 text-black font-medium' : ''}`}
                        >
                            {spec}
                        </p>
                    ))}
                </div>

                {/* Doctor Cards Grid */}
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => {
                            // --- THIS IS THE ONLY CHANGE NEEDED ---
                            // Since your API provides the full URL (e.g., http://...), we can use it directly.
                            // We also provide a fallback placeholder if the image field is null.
                            const imageUrl = doctor.image || 'https://via.placeholder.com/300x225?text=No+Image';

                            return (
                                <div
                                    onClick={() => navigate(`/appointment/${doctor.id}`)}
                                    className='bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-1 transform transition duration-300 overflow-hidden group'
                                    key={doctor.id}
                                >
                                    <div className='w-full aspect-[4/3] bg-blue-50 overflow-hidden'>
                                        <img
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                            src={imageUrl}
                                            alt={`Dr. ${doctor.user.first_name} ${doctor.user.last_name}`}
                                            // onError handles cases where the URL is valid but the image file is broken/missing
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x225?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className='p-4 space-y-1'>
                                        <div className='flex items-center gap-2 text-sm text-green-600 mb-1'>
                                            <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                            <span className='font-medium'>Available</span>
                                        </div>
                                        <p className='text-lg font-semibold text-gray-800 truncate'>
                                            Dr. {doctor.user.first_name} {doctor.user.last_name}
                                        </p>
                                        <p className='text-sm text-black'>{doctor.specialization}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10">
                            {doctors.length === 0 ? "Loading doctors..." : "No doctors match the selected specialty."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;