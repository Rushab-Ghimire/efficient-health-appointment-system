import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();
    const [relDoc, setRelDocs] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter(
                (doc) => doc.speciality === speciality && doc._id !== docId
            );
            setRelDocs(doctorsData);
        }
    }, [doctors, speciality, docId]);

    return (
        <div>
            <div className='flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10'>
                <h1 className='text-3xl font-bold text-blue-800 tracking-tight border-b-2 border-blue-200 pb-2'>
                    Related Doctors
                </h1>


                <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 pt-10'>
                    {doctors.slice(0, 5).map((item, index) => (
                        <div
                            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                            className='bg-white border border-blue-200 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer hover:-translate-y-1 transform transition-all duration-300 overflow-hidden hover:border-blue-500'
                            key={index}
                        >
                            <img
                                className='w-full h-44 object-cover bg-blue-50'
                                src={item.image}
                                alt={item.name}
                            />
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-green-600 mb-1'>
                                    <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                                    <span className='font-medium'>Available</span>
                                </div>
                                <p className='text-lg font-semibold text-gray-800 truncate'>{item.name}</p>
                                <p className='text-sm text-blue-600'>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => { navigate('/doctors'); scroll(0, 0); }}
                    className='bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-10 py-3 rounded-full mt-10 hover:shadow-lg hover:scale-105 transition duration-300'
                >
                    View All Doctors
                </button>
            </div>
        </div>
    );


};

export default RelatedDoctors;
