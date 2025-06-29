import React from 'react'
import { assets } from '../assets/assets'

const contact = () => {
  return (
    <div className='className="flex flex-col md:flex-row items-center rounded-b-4xl bg-gradient-to-r from-cyan-300 via-blue-200 to-blue-200  px-6 md:px-16 py-16 md:py-24 gap-12 md:gap-10 shadow-2xl overflow-hidden transition-all duration-500"'>

      <div className='text-center text-3xl  font-bold text-gray-800 mb-3'>
        <p>CONTACT US</p>
      </div>

      <div className='px-25 py-5 flex flex-col md:flex-row gap-5'>
        <img className='w-full md:max-w-[360px] rounded-2xl shadow-lg  ' src={assets.about_image} alt="Contact" />

        <div className='flex flex-col justify-center px-20 py-6 gap-6 bg-white p-6 rounded-2xl shadow-lg text-gray-800'>
          <p className='font-semibold text-3xl'>OUR OFFICE</p>

          <p className='text-2xl leading-relaxed'>
            5207 BPKHIS <br /> DHARAN, SUNSARI
          </p>

          <p className='text-2xl leading-relaxed'>
            Phone: +977 9825476625 <br />
            Email: medicalcare77@gmail.com
          </p>

          <p className='font-semibold text-2xl'>Careers at Medical Care</p>
          <p className='text-2xl'>Learn more about our teams and job openings.</p>

          <button className='border rounded-3xl border-black text-black px-8 py-4 text-2xl hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-xl px-15 py-5 md:p-10 max-w-3xl mx-auto mt-10'>
        <p className='text-2xl font-semibold text-center text-gray-700 mb-6'>Contact Us</p>

        <form className='flex flex-col gap-4 rounded-3xl'>
          <input
            type='text'
            placeholder='Your Name'
            className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-300'
          />
          <input
            type='email'
            placeholder='Your Email'
            className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-300'
          />
          <textarea
            rows='4'
            placeholder='Your Message'
            className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-300'
          ></textarea>
          <button
            type='submit'
            className='bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all duration-300'
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default contact
