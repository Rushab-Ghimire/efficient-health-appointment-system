import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleBookClick = () => {
        setShowProfileMenu(true);
        navigate('#speciality');
    };

    return (
        <div className='bg-sky-100 flex items-center justify-between text-sm py-7 mb-8 border-b border-b-gray-300 px-4 md:px-10 shadow-sm'>
            <img onClick={() => navigate('/')} className='w-58 hover:scale-105 transition-transform duration-400 cursor-pointer drop-shadow-lg' src={assets.logo} alt="" />
            
            <ul className='hidden md:flex items-start gap-6 font-medium'>
                <NavLink to='/'>
                    <li className='py-1 text-2xl'>HOSPITAL OVERVIEW</li>
                    <hr className='border-none outline-none h-1 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1 text-2xl'>FIND DOCTORS</li>
                    <hr className='border-none outline-none h-1 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/my-appointments'>
                    <li className='py-1 text-2xl'>MY APPOINTMENTS</li>
                    <hr className='border-none outline-none h-1 bg-blue-500 w-3/5 m-auto hidden' />
                </NavLink>

                <button
                    onClick={handleBookClick}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-7 py-5 rounded-full text-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                    Book Appointment Now
                    <img className="w-8 animate-bounce" src={assets.arrow_button} alt="Arrow" />
                </button>
            </ul>

            {/* Show profile dropdown only when Book is clicked */}
            {showProfileMenu && (
                <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2 cursor-pointer group relative'>
                        <img className='w-12 rounded-full' src={assets.Profile_pic} alt=" " />
                        <img className='w-4' src={assets.icon} alt=" " />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer text-2xl'>My Profile</p>
                                <p onClick={() => setShowProfileMenu(false)} className='hover:text-black cursor-pointer text-2xl'>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOSPITAL OVERVIEW</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>FIND DOCTORS</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
