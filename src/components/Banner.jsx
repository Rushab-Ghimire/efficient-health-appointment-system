import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-3xl px-6 sm:px-10 md:px-14 lg:px-16 my-20 mx-4 md:mx-10 shadow-xl overflow-hidden">

      {/* Left Side */}
      <div className="flex-1 py-10 sm:py-14 md:py-20 lg:py-24 text-white z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
          Book Your Appointment<br />
          With <span className="text-yellow-300">100+ Trusted Doctors</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-blue-100">
          Get the best healthcare services with just one click.
        </p>
        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0); }}
          className="mt-8 px-8 py-3 sm:px-10 sm:py-4 bg-white text-blue-700 font-semibold text-lg rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          Create Account
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center md:w-1/2 lg:w-[450px] ">
        <img
          className="w-full h-full object-contain drop-shadow-xl"
          src={assets.appointment_img}
          alt="Appointment"
        />
      </div>
    </div>
  );
};

export default Banner;
