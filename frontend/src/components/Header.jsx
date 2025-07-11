import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-cyan-300 via-cyan-100 to-blue-100 px-6 md:px-16 py-20 md:py-24 gap-10 rounded-b-3xl overflow-hidden transition-all duration-500">
            
            {/* ----- Left Side ------ */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 text-black">
                <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug tracking-wide drop-shadow-md">
                    Book Appointment <br /> with Trusted Doctors
                </p>

                <div className="flex items-start gap-4">
                    <img
                        className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
                        src={assets.group_profiles}
                        alt="Group Profiles"
                    />
                    <p className="text-base md:text-2xl font-light leading-relaxed text-black">
                        Browse trusted professionals and get care at your convenience.
                        Fast, easy, and reliable appointment bookings all in one place.
                    </p>
                </div>

                <a
                    href="#speciality"
                    className="flex items-center gap-2 bg-green-600 text-white font-semibold px-13 py-5 rounded-full text-2xl shadow-md hover:scale-105 hover:bg-green-600 transition duration-300"
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
