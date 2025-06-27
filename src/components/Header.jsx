import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 rounded-3xl px-6 md:px-16 py-16 md:py-24 gap-12 md:gap-10 shadow-2xl overflow-hidden transition-all duration-500">
            
            {/* ----- Left Side ------ */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 text-white">
                <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug tracking-wide drop-shadow-md">
                    Book Appointment <br /> with Trusted Doctors
                </p>

                <div className="flex items-start gap-4">
                    <img
                        className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
                        src={assets.group_profiles}
                        alt="Group Profiles"
                    />
                    <p className="text-base md:text-lg font-light leading-relaxed text-blue-100">
                        Browse trusted professionals and get care at your convenience.
                        Fast, easy, and reliable appointment bookings all in one place.
                    </p>
                </div>

                <a
                    href="#speciality"
                    className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full text-lg shadow-md hover:scale-105 hover:bg-gray-100 transition duration-300"
                >
                    Book Appointment
                    <img className="w-5 animate-bounce" src={assets.arrow_button} alt="Arrow" />
                </a>
            </div>

            {/* ----- Right Side ------ */}
            <div className="md:w-1/2 relative flex justify-center items-center">
                <img
                    className="w-full md:w-[90%] max-h-[500px] object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                    src={assets.header_pro}
                    alt="Header Doctor"
                />
            </div>
        </div>
    )
}

export default Header
