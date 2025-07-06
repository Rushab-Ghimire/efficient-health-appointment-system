import React from 'react';
import { assets } from '../assets/assets';
import { FaUser, FaRegCommentDots } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    });
    e.target.reset(); // clears the form
  };

  return (
    <div className='flex flex-col md:flex-row flex-wrap items-center rounded-b-4xl bg-white px-4 md:px-1 py-1 md:py-2 gap-12 md:gap-5 shadow-2xl overflow-hidden transition-all duration-500'>

      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <div className='text-center w-full'>
        <p className='text-4xl md:text-4xl font-extrabold text-gray-800 mb-6'>
          CONTACT <span className='text-gray-900 mt-2'>US</span>
        </p>
      </div>

      {/* Image and Office Info */}
      <div className='w-full flex flex-col md:flex-row items-center gap-1 px-65 py-7'>

        <img className='w-full md:max-w-[360px] bg-cyan-300 ' src={assets.about_image} alt="Contact" />

        <div className='flex flex-col justify-center px-6 md:px-20 py-6 gap-4 bg-blue-200 rounded-2xl shadow-lg text-gray-800 '>
          <p className='font-bold  text-3xl md:text-3xl '>OUR OFFICE</p>

          <p className='text-lg md:text-xl leading-relaxed'>
            5207 BPKHIS <br /> DHARAN, SUNSARI
          </p>

          <p className='text-lg md:text-xl leading-relaxed'>
            Phone: +977 9825476625 <br />
            Email: medicalcare77@gmail.com
          </p>

          <p className='font-semibold text-2xl mt-2'>Careers at Medical Care</p>
          <p className='text-base md:text-lg'>Learn more about our teams and job openings.</p>

          <button className='border rounded-3xl border-black bg-white text-black px-6 py-3 text-lg hover:bg-black hover:text-white transition-all duration-500 w-fit'>
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Contact Form */}
      <div className='bg-cyan-100 rounded-3xl shadow-lg px-10 py-16 md:p-15 w-full max-w-3xl mx-auto mt-7 mb-5'>
        <p className='text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6'>Send Us a Message</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 rounded-3xl'>

          {/* Name Input */}
          <div className='relative'>
            <FaUser className='absolute top-3.5 left-3 text-gray-500 text-lg' />
            <input
              type='text'
              placeholder='Your Name'
              required
              className='pl-10 border border-black rounded-md p-3 text-base md:text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300'
            />
          </div>

          {/* Email Input */}
          <div className='relative'>
            <MdEmail className='absolute top-3.5 left-3 text-gray-500 text-lg' />
            <input
              type='email'
              placeholder='Your Email'
              required
              className='pl-10 border  rounded-md p-3 text-base md:text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300'
            />
          </div>

          {/* Message Textarea */}
          <div className='relative'>
            <FaRegCommentDots className='absolute top-3 left-3 text-gray-500 text-lg' />
            <textarea
              rows='4'
              placeholder='Your Message'
              required
              className='pl-10 pt-3 border rounded-md p-3 text-base md:text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300'
            ></textarea>
          </div>

          <button
            type='submit'
            className='bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-600 transition-all duration-300'
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact;
