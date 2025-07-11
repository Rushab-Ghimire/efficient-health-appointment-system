import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10'>
            
            <h1 className='text-5xl font-extrabold text-cyan-800 tracking-tight'>Meet Our Top Doctors</h1>
            <p className='sm:w-2/3 text-center text-2xl text-gray-900 leading-relaxed'>
                Discover a team of compassionate and highly skilled doctors committed to your health and well-being.
                Browse profiles and book your appointment instantly with just a click.
            </p>

            <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 pt-10'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => navigate(`/appointment/${item._id}`)}
                        className='bg-white border border-blue-100 rounded-3xl shadow-md hover:shadow-xl cursor-pointer hover:-translate-y-1 transform transition-all duration-300 overflow-hidden'
                        key={index}
                    >
                        {/* Responsive image wrapper */}
                        <div className='aspect-[4/3] w-full bg-blue-50'>
                            <img
                                className='w-full h-full object-contain'
                                src={item.image}
                                alt={item.name}
                            />
                        </div>

                        {/* Doctor Info */}
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-green-600 mb-1'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                <span className='font-medium'>Available</span>
                            </div>
                            <p className='text-lg font-semibold text-gray-800'>{item.name}</p>
                            <p className='text-sm text-blue-600'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>


            <button
                onClick={() => { navigate('/doctors'); scroll(0, 0) }}
                className='bg-green-400 text-white font-semibold px-10 py-3 rounded-full mt-10 hover:bg-blue-700 hover:shadow-lg transition duration-300'
            >
                View All Doctors
            </button>
        </div>
    )
}

export default TopDoctors
