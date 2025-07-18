import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    // yo main section ho jasma pura about us content xa
    <div className='px-6 md:px-20 py-10 bg-gradient-to-b from-white via-blue-50 to-blue-100 rounded-3xl'>

      {/* // heading part jasle "About Us" dekhaauxa */}
      <div className='text-center text-3xl md:text-4xl font-semibold text-gray-600 mb-8'>
        <p>ABOUT <span className='text-gray-700'>US</span></p>
      </div>

      {/* // image ra description ko section, responsive banaeko */}
      <div className='my-10 flex flex-col md:flex-row gap-12 items-center'>

        {/* // yo chai image ho, shadow ani round corner diyeko xa */}
        <img className='w-full md:max-w-[360px] rounded-xl shadow-lg' src={assets.about_image} alt="About us" />

        {/* // right side ko description part ho, small text with spacing */}
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-[15px] text-gray-700 leading-relaxed'>

          {/* // welcome message */}
          <p className='text-3xl font-medium text-gray-800'>
            Welcome to our <span className='text-gray-700 font-semibold'>Smart Health Appointment System</span>!
          </p>

          {/* // features ko overview */}
          <p className='text-lg'>
          "Our system provides helpful features like online appointment booking, hospital navigation, and SMS reminders. This saves patients time and makes the entire process smoother."
          </p>
          <p>
            "We use React.js for the frontend, Django for the backend, and integrate PostgreSQL along with the Sparrow SMS API to ensure the system is both reliable and efficient."
          </p>
          {/* 
          // vision title */}
          <b className='text-2xl text-gray-800 mt-4'>Our Vision</b>
          <p className='text-lg'>
            "Our vision is to improve digital healthcare access in Nepal. We aim to connect patients and hospitals quickly and easily through the power of technology."
          </p>
        </div>
      </div>

      {/* // choose us heading part */}
      <div className='text-lg md:text-2xl font-semibold my-8 text-center text-gray-700'>
        <p>WHY <span className='text-gray-700'>Choose Us</span></p>
      </div>

      {/* // 3 reasons dekhayeko section - efficiency, convenience, personalization */}
      <div className='flex flex-col md:flex-row justify-center gap-6 md:gap-10 mb-20'>

        {/* // efficiency card */}
        <div className='bg-white border hover:shadow-xl rounded-xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 text-[15px] transition-all duration-300'>
          <b className='text-cyan-600 text-2xl'>EFFICIENCY</b>
          <p className='text-gray-600 text-lg'>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        {/* // convenience card */}
        <div className='bg-white border hover:shadow-xl rounded-xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 text-[15px] transition-all duration-300'>
          <b className='text-cyan-600 text-2xl'>CONVENIENCE</b>
          <p className='text-gray-600 text-lg'>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        {/* // personalization card */}
        <div className='bg-white border hover:shadow-xl rounded-xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 text-[15px] transition-all duration-300'>
          <b className='text-cyan-600 text-2xl'>PERSONALIZATION</b>
          <p className='text-gray-600 text-lg'>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
