import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-6 py-20 text-gray-800 bg-gradient-to-b from-blue-50 to-white' id='speciality'>
      <h1 className='text-6xl font-extrabold text-cyan-800'>Find by Speciality</h1>
      <p className='sm:w-1/2 text-center text-2xl text-gray-900 leading-relaxed'>
        Discover experienced specialists across various fields and easily schedule your appointments.
      </p>

      <div className='flex sm:justify-center gap-8 pt-15 w-full px-25 overflow-x-auto scrollbar-hide'>
        {specialityData.map((item, index) => (
          <Link 
            onClick={() => scroll(0, 0)}
            className='flex flex-col items-center text-sm cursor-pointer flex-shrink-0 bg-white shadow-md hover:shadow-xl rounded-2xl px-6 py-4 hover:-translate-y-2 transform transition-transform duration-300 ease-in-out'
            key={index}
            to={`/doctors/${item.speciality}`}
          >
            <img className='w-20 h-20 mb-3 rounded-full border-4 border-blue-100 shadow-sm' src={item.image} alt={item.speciality} />
            <p className='text-gray-800 font-semibold tracking-wide'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu

