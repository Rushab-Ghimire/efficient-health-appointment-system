// Navbar.jsx with CSS-only dropdowns and click toggle
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  User,
  CalendarCheck,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';

import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    setIsLoggedIn(!!token);
    if (user) setUsername(user);
  }, []);

  const handleBookClick = () => {
    if (!isLoggedIn) navigate('/login');
    else navigate('/topdoctors');
  };
  {/*this is for dummy change here for backend*/ }
   const handleDummyLogin = () => {
    setToken(true);
    setShowSidebar(false);
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prev) => (prev === menu ? null : menu));
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
        {/* Left: Hamburger (always visible) + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-md hover:bg-cyan-800 transition border border-white shadow-sm"
            aria-label="Open Menu"
          >
            <Menu size={26} className="text-white" />
          </button>

          <img
            src={assets.logo}
            alt="Logo"
            className="w-28 cursor-pointer"
            onClick={() => {
              navigate('/');
              setShowSidebar(false);
            }}
          />
        </div>

        {/* Right: Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-lg">
          {/* Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => setActiveDropdown('overview')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center  bg-slate-200 rounded-md  p-2 gap-1 cursor-pointer text-lg text-black ">
              HOSPITAL OVERVIEW <ChevronDown size={16} />
            </div>
            {activeDropdown === 'overview' && (
              <div className="absolute top-full  bg-white text-black rounded-md shadow-lg w-48 z-50">
                {dropdowns.overview.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className="block px-4 py-2 hover:bg-cyan-100"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </li>

          <NavLink to="/doctors" className="p-2 bg-slate-200 rounded-md hover:bg-green-200 hover:underline  underline-offset-4   text-black shadow-sm ">
            FIND DOCTORS
          </NavLink>

          <button
            onClick={() => navigate('/login')}
            className="bg-green-500 hover:bg-green-800 text-white px-5 py-2 rounded-2xl transition"
          >
            Book Appointment
          </button>
        </ul>
      </div>

      {/* SIDEBAR */}
      {showSidebar && (
        <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col justify-between transition-transform duration-300 animate-slide-in">
          {/* Sidebar Header with Close Icon */}
          <div className="bg-gray-100 px-6 py-6 flex items-center justify-between">
            <img
              src={assets.logo}
              alt="Sidebar Logo"
              className="w-36 cursor-pointer"
              onClick={() => {
                navigate('/');
                setShowSidebar(false);
              }}
            />
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-600 hover:text-red-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Links */}
          <div className="px-6 py-6 flex flex-col gap-5 text-gray-800 text-lg font-medium">
            {token ? (
              <>
                <NavLink
                  to="/my-profile"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-3 hover:text-green-600"
                >
                  <User size={20} /> My Profile
                </NavLink>
                <NavLink
                  to="/my-appointments"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-3 hover:text-green-600"
                >
                  <CalendarCheck size={20} /> My Appointments
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setShowSidebar(false)}
                  className="flex items-center gap-3 hover:text-green-600"
                >
                  <Settings size={20} /> Settings
                </NavLink>
              </>
            ) : (
              <button
                onClick={handleDummyLogin}
                className="bg-green-500 text-white font-medium px-4 py-2 rounded-full shadow hover:bg-green-600"
              >
                Login to view options
              </button>
            )}
          </div>

          {/* Logout */}
          {token && (
            <div className="px-6 py-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-600 hover:text-red-800"
              >
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
