// src/pages/Doctors.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar'; // Assuming you have this component

const Doctors = () => {
    const { speciality } = useParams();
    const navigate = useNavigate();
    // Get the global, pre-fetched list of doctors from the context
    const { doctors } = useContext(AppContext);
    
    // No need for a separate loading state here, the context handles it.
    
    const specialitiesList = [
        "Cardiologist", "Dermatologist", "Gastroenterologist", "Neurologist", 
        "Orthopedist", "Allergist", "Rheumatologist", "General Physician", "Gynecologist", "Pediatricians"
    ].sort(); // Sort them alphabetically for a better UI

    // Perform all filtering directly on the doctors list from the context
    const filteredDoctors = doctors
        .filter(doc => !speciality || doc.specialization.toLowerCase() === speciality.toLowerCase())
        // If you add a search bar component, its search term would be used here
        // .filter(doc => doc.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className='px-4 sm:px-10 py-6'>
            <p className='text-gray-600 text-lg mb-4'>Browse through our specialists.</p>
            {/* <SearchBar /> */}
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
                            // The image URL comes directly from the doctor object
                            const imageUrl = doctor.image || 'https://via.placeholder.com/300x225?text=No+Image';

                            return (
                                <div
                                    onClick={() => navigate(`/appointment/${doctor.id}`)}
                                    className='bg-white border border-blue-100 rounded-2xl shadow-md ...' // your styles
                                    key={doctor.id}
                                >
                                    <div className='w-full aspect-[4/3] bg-blue-50 overflow-hidden'>
                                        <img
                                            className='w-full h-full object-cover ...' // your styles
                                            src={imageUrl}
                                            alt={`Dr. ${doctor.full_name}`}
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x225?text=No+Image'; }}
                                        />
                                    </div>
                                    <div className='p-4 space-y-1'>
                                        <div className='flex items-center ...'> {/* your styles */}
                                            <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                            <span className='font-medium'>Available</span>
                                        </div>
                                        <p className='text-lg font-semibold ...'>
                                            {/* --- THIS IS THE FIX --- */}
                                            {/* Use the 'full_name' field from the DoctorSerializer */}
                                            Dr. {doctor.full_name}
                                        </p>
                                        <p className='text-sm text-black'>{doctor.specialization}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10">
                            No doctors match the selected specialty.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;