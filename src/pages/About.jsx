import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span> </p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>WElcome to our smart Health appointment system!!!</p>
          <p>Our Efficient Health Appointment System is designed to improve healthcare access by offering online appointment booking, integrated hospital navigation, and automated SMS reminders. This helps reduce long wait times, prevent missed appointments, and make hospital visits more efficient. Patients can easily access the system from any internet-connected device, ensuring convenience and speed.</p>
          <p>Technically, the platform is built using React.js for the frontend and Django REST Framework for the backend, ensuring a responsive, scalable, and secure system. PostgreSQL is used to manage healthcare data efficiently, while Sparrow SMS API integration sends real-time reminders to patients. QR code generation and doctor availability filters further streamline the appointment process.</p>

          <b className='text-gray-800'>  Our Vision </b>
          <p>Our vision is to revolutionize healthcare accessibility in Nepal by creating a smart, reliable, and user-friendly digital platform for hospital appointments. We aim to bridge the gap between patients and healthcare services through innovative technology that ensures timely care, improved communication, and reduced hospital congestion. By promoting digital transformation in the medical sector, we aspire to make quality healthcare more efficient, inclusive, and accessible for everyone.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>EFFICIENCY :</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>CONVENIENCE :</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px]'>
          <b>PERSONALIZATION :  </b>
          <p>Tailored recommendations and remainders to help you stay on top of your health.</p>
        </div>

      </div>

    </div>
  )
}

export default About