import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { assets } from '../assets/assets';
 

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [token, setToken] = useState(true); 

  const handleBookClick = () => navigate('/login');
  const handleLogout = () => {
    alert('Logout logic here');
    setToken(false);
  };
  {/* Dropdown tei hospital overview and our services ko lagi */}
  const dropdowns = {
    overview: [
      { name: 'About Us', link: '/about' },
      { name: 'Contact Us', link: '/contact' },
    ],
    services: [
      { name: 'My Profile', link: '/my-profile' },
      { name: 'My Appointments', link: '/my-appointments' },
      { name: 'Maps', link: '/maps' },
    ],
  };

  return ( 
    <div className="bg-gradient-to-r from-[#e0f7fa] via-[#80deea] to-[#26c6da] shadow-md  top-0 z-50 px-6 md:px-12 py-5 flex justify-between items-center h-[100px] md:h-[130px] transition-all duration-300">

      {/* brand ko logo  */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="w-44 cursor-pointer hover:scale-105 transition-transform"
      />

      {/* Desktop ko lagi  */}
      <ul className="hidden md:flex items-center gap-6 text-gray-800 font-medium text-lg">
        {token && (
          <li
            className="relative group"
            onMouseEnter={() => setActiveDropdown('overview')}   
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 cursor-pointer text-2xl">
              HOSPITAL OVERVIEW
              <ChevronDown size={18} />
            </div>
            {activeDropdown === 'overview' && (
              <div className="absolute top-full bg-white rounded-md shadow-lg py-2 w-60 z-50">
                {dropdowns.overview.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className="block px-4 py-2 hover:bg-blue-100 text-gray-800 transition"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        )}

        <NavLink to="/doctors" className="hover:underline text-2xl">
          FIND DOCTORS
        </NavLink>

        {token && (
          <li
            className="relative group"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center gap-1 cursor-pointer text-2xl">
              OUR SERVICES
              <ChevronDown size={18} />
            </div>
            {activeDropdown === 'services' && (
              <div className="absolute top-full  bg-white rounded-md shadow-lg py-2 w-60 z-50">
                {dropdowns.services.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className="block px-4 py-2 hover:bg-blue-100 text-gray-800 transition"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        )}

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          <button
            onClick={handleBookClick}
            className="bg-white hover:bg-blue-50 text-black font-medium px-5 py-2 rounded-full shadow-md transition"
          >
            Book Appointment
          </button>
          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-full shadow-sm transition"
            >
              Logout
            </button>
          )}
        </div>
      </ul>

      {/* Mobile Menu Button */}
      <img
        onClick={() => setShowMenu(true)}
        src={assets.menu_icon}
        alt="Menu"
        className="w-7 md:hidden cursor-pointer"
      />

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed top-0 right-0 w-full h-full bg-white z-30 px-6 py-4 md:hidden overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <img src={assets.logo} alt="Logo" className="w-36" />
            <img
              src={assets.cross_icon}
              alt="Close"
              className="w-6 cursor-pointer"
              onClick={() => setShowMenu(false)}
            />
          </div>
          <ul className="flex flex-col gap-4 text-gray-800 text-base font-semibold">
            {token && (
              <>
                <NavLink to="/" onClick={() => setShowMenu(false)}>HOSPITAL OVERVIEW</NavLink>
                {dropdowns.overview.map(d => (
                  <NavLink key={d.name} to={d.link} onClick={() => setShowMenu(false)}>{d.name}</NavLink>
                ))}
              </>
            )}
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>Find Doctors</NavLink>
            {token && dropdowns.services.map(d => (
              <NavLink key={d.name} to={d.link} onClick={() => setShowMenu(false)}>{d.name}</NavLink>
            ))}
            <button
              onClick={handleBookClick}
              className="bg-blue-200 px-4 py-2 rounded-full mt-4"
            >
              Book Appointment
            </button>
            {token && (
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-full mt-2"
              >
                Logout
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
