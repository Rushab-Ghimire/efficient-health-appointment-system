// src/components/Navbar.jsx

import React, { useState, useContext } from 'react'; // <-- Import useContext
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // <-- Import your context
import {
  Menu, User, CalendarCheck, LogOut, ChevronDown, X
} from 'lucide-react';
import { assets } from '../assets/assets';
import { MapPin } from 'lucide-react'; 


const Navbar = () => {
  const navigate = useNavigate();
  // --- 1. Get everything from the context ---
  const { token, user, logout } = useContext(AppContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- 2. Simplified Logout Handler ---
  const handleLogout = () => {
    logout(); // Call the logout function from the context
    setShowSidebar(false);
    navigate('/'); // Navigate to the homepage after logout
  };

  const dropdowns = {
    overview: [
      { name: 'About Us', link: '/about' },
      { name: 'Contact Us', link: '/contact' },
    ],
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-cyan-500 text-white shadow-md flex items-center justify-between px-6 py-4">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-md hover:bg-cyan-800 transition border border-white shadow-sm"
            aria-label="Open Menu"
          >
            <Menu size={26} className="text-white" />
          </button>
          <NavLink to="/">
            <img src={assets.logo} alt="Logo" className="w-28 cursor-pointer" />
          </NavLink>
        </div>

        {/* Right: Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-lg">
          <li
            className="relative group"
            onMouseEnter={() => setActiveDropdown('overview')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center bg-slate-200 rounded-md p-2 gap-1 cursor-pointer text-lg text-black">
              HOSPITAL OVERVIEW <ChevronDown size={16} />
            </div>
            {activeDropdown === 'overview' && (
              <div className="absolute top-full bg-white text-black rounded-md shadow-lg w-48 z-50">
                {dropdowns.overview.map((item) => (
                  <NavLink key={item.name} to={item.link} className="block px-4 py-2 hover:bg-cyan-100">
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
          <NavLink to="/doctors" className="p-2 bg-slate-200 rounded-md hover:bg-green-200 hover:underline underline-offset-4 text-black shadow-sm">
            FIND DOCTORS
          </NavLink>

         

          {/* --- 1. ADD THE AI DOCTOR FINDER LINK HERE FOR DESKTOP --- */}
          <NavLink to="/ai-doctor-finder" className="p-2 bg-slate-200 rounded-md hover:bg-green-200 hover:underline underline-offset-4 text-black shadow-sm font-bold">
            AI Doctor Finder
          </NavLink>
          
          {/* --- 3. Conditional "Book Appointment" Button --- */}
          {/* This button now correctly links to the doctors page so the user can choose a doctor. */}
          <NavLink to="/doctors">
            <button className="bg-green-500 hover:bg-green-800 text-white px-5 py-2 rounded-2xl transition">
                Book Appointment
            </button>
          </NavLink>
        </ul>
      </div>

      {/* SIDEBAR */}
      {showSidebar && (
        <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col justify-between transition-transform duration-300 animate-slide-in">
          <div className="bg-gray-100 px-6 py-6 flex items-center justify-between">
            <NavLink to="/" onClick={() => setShowSidebar(false)}>
              <img src={assets.logo} alt="Sidebar Logo" className="w-36 cursor-pointer" />
            </NavLink>
            <button onClick={() => setShowSidebar(false)} className="text-gray-600 hover:text-red-600">
              <X size={24} />
            </button>
          </div>

          {/* --- 4. Sidebar links now depend on the context 'token' --- */}
          <div className="px-6 py-6 flex-1 flex flex-col gap-5 text-gray-800 text-lg font-medium">
            {token ? (
              <>
                {/* Display the user's name if available */}
                {user && <p className="font-bold text-cyan-700">Welcome, {user.first_name}!</p>}
                
                <NavLink to="/my-profile" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 hover:text-green-600">
                  <User size={20} /> My Profile
                </NavLink>
                <NavLink to="/my-appointments" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 hover:text-green-600">
                  <CalendarCheck size={20} /> My Appointments
                </NavLink>
                <NavLink to="/map" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 hover:text-green-600">
                              <MapPin size={20} /> Hospital Map
                 </NavLink>
                
              </>
            ) : (
              <NavLink to="/login" onClick={() => setShowSidebar(false)}>
                <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-green-600 w-full">
                  Login / Sign Up
                </button>
              </NavLink>
            )}
          </div>
          
          {/* Logout button only shows if logged in */}
          {token && (
            <div className="px-6 py-6 border-t border-gray-200">
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 hover:text-red-800 w-full">
                <LogOut size={20} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;