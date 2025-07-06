import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="bg-gray-100 text-gray-700 sm:px-25 py-2 mt-10 rounded-t-3xl shadow-inner">
      {/* Main Footer Content */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 sm:gap-14 py-20 text-sm md:text-base">
        
        {/* Left Section */}
        <div>
          <img className="mb-6 w-44" src={assets.logo} alt="Medical Care Logo" />
          <p className="md:w-4/5 text-gray-600 leading-relaxed text-2xl">
            "Book trusted healthcare appointments easily and efficiently. Your health, your schedule, your control."
          </p>
        </div>

        {/* Center Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-5 text-blue-900">COMPANY</h3>
          <ul className="space-y-2">
            <li className="hover:text-blue-700 transition duration-200 cursor-pointer">Home</li>
            <li className="hover:text-blue-700 transition duration-200 cursor-pointer">About Us</li>
            <li className="hover:text-blue-700 transition duration-200 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-700 transition duration-200 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-5 text-blue-900">GET IN TOUCH</h3>
          <ul className="space-y-2">
            <li className="hover:text-blue-700 transition duration-200">+977 9825476625</li>
            <li className="hover:text-blue-700 transition duration-200">medicalcare77@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300" />

      {/* Bottom Bar */}
      <div className="text-center text-lg text-gray-500 py-6">
        © 2025 <span className="font-semibold text-blue-600">Medical Care</span> — All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
