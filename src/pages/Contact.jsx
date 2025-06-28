import React from 'react'
import { assets } from '../assets/assets'

const contact = () => {
  return (
    <div>
      <div className='text-center text-3xl pt-10 text-black'>
        <p> CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-25 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-3xl text-black'>OUR OFFICE</p>
          <p className='text-black text-2xl'>5207 BPKHIS <br />DHARAN,SUNSARI</p>
          <p className='text-black text-2xl'>Phone Number : +977 9825476625 <br /> Email: medicalcare77@gmail.com</p>
          <p className='font-semibold text-2xl'>Careers at Medical Care</p>
          <p className='text-black text-2xl'>Learn more about our teams and job openings.</p>
          <button className='border rounded-3xl border-black  text-black px-8 py-4 text-2xl hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default contact
