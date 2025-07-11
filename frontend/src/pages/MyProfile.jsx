import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Myprofile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.Profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+977 123 456 7890',
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2000-01-20'
  })

  const [isEdit, setIsEdit] = useState(false)

  return (
     <div className='min-h-screen flex justify-center items-center bg-gradient-to-b from-white via-indigo-50 to-blue-100 px-4 py-10'>
      <div className='bg-white border border-blue-100 rounded-2xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-4 text-sm text-slate-700'>

        {/* Profile Image & Name */}
        <div className='flex flex-col items-center'>
          <img className='w-36 rounded-xl shadow-md' src={userData.image} alt="Profile" />
          {isEdit ? (
            <input
              className='mt-4 text-2xl font-semibold text-center bg-indigo-50 px-2 py-1 rounded-md'
              type="text"
              value={userData.name}
              onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className='mt-4 text-3xl font-bold text-cyan-700'>{userData.name}</p>
          )}
        </div>

        <hr className='border-blue-200 my-2' />

        {/* Contact Info */}
        <div>
          <p className='text-cyan-900 font-semibold underline mb-2'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 mt-2 text-slate-700'>
            <p className='font-medium'>Email:</p>
            <p className='text-black'>{userData.email}</p>

            <p className='font-medium'>Phone:</p>
            {isEdit ? (
              <input
                className='bg-indigo-50 rounded-md px-2 py-1 w-full'
                type="text"
                value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className='text-black'>{userData.phone}</p>
            )}

            <p className='font-medium'>Address:</p>
            {isEdit ? (
              <div className='flex flex-col gap-2'>
                <input
                  className='bg-indigo-50 rounded-md px-2 py-1'
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                />
                <input
                  className='bg-indigo-50 rounded-md px-2 py-1'
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                />
              </div>
            ) : (
              <p className='text-black'>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <p className='text-cyan-900 font-semibold underline mt-4 mb-2'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 text-black'>
            <p className='font-medium'>Gender:</p>
            {isEdit ? (
              <select
                className='bg-indigo-50 px-2 py-1 rounded-md w-32'
                value={userData.gender}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='text-black'>{userData.gender}</p>
            )}

            <p className='font-medium'>Birthday:</p>
            {isEdit ? (
              <input
                className='bg-indigo-50 px-2 py-1 rounded-md w-32'
                type="date"
                value={userData.dob}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            ) : (
              <p className='text-black'>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className='flex justify-center mt-6'>
          <button
            className='px-8 py-2 border border-blue-900 text-black bg-green-400 font-medium rounded-full hover:bg-blue-600 hover:text-white transition-all'
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? 'Save Information' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
