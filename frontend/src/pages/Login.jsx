// pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Use axios for this one-off auth call

const Login = () => {
  const [state, setState] = useState('Login');
// Updated formData to include the new fields
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    temporaryAddress: '',
    permanentAddress: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthday: '',
  });
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const authUrl = 'http://127.0.0.1:8000/auth/token/';
    const registerUrl = 'http://127.0.0.1:8000/api/users/';

     // Add validation for password confirmation
    if (state === 'Sign Up') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return; // Stop the form submission
      }
    }
     console.log('Form State:', state);
    console.log('Form Data:', formData);

    try {
      if (state === 'Login') {
        const response = await axios.post(authUrl, {
          username: formData.username,
          password: formData.password,
        });
        const token = response.data.token;
        login(token); // Call the login function from context
        navigate('/'); // Redirect to homepage
      } else { // Sign Up
        await axios.post(registerUrl, formData);
        // After successful sign up, automatically log them in
        const response = await axios.post(authUrl, {
          username: formData.username,
          password: formData.password,
        });
        const token = response.data.token;
        login(token);
        navigate('/');
      }
    } catch (error) {
      console.error(`${state} failed`, error.response.data);
      alert(`Error: ${JSON.stringify(error.response.data)}`);
    }
  };

 return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[500px] border rounded-xl text-black text-sm shadow-lg bg-white'>
        <p className='text-3xl text-black text-center font-semibold'>{state}</p>

        {/* =================== SIGN UP FIELDS =================== */}
        {state === 'Sign Up' ? (
          <>
            {/* Row 1: Name */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>First Name</p>
                <input name="firstName" onChange={handleChange} value={formData.firstName} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
              <div className='sm:w-1/2'>
                <p>Last Name</p>
                <input name="lastName" onChange={handleChange} value={formData.lastName} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>Email</p>
                <input name="email" onChange={handleChange} value={formData.email} required className='border border-black rounded w-full p-2 mt-1' type='email' />
              </div>
              <div className='sm:w-1/2'>
                <p>Phone Number</p>
                <input name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} required className='border border-black rounded w-full p-2 mt-1' type='tel' />
              </div>
            </div>

            {/* Row 3: Address */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>Temporary Address</p>
                <input name="temporaryAddress" onChange={handleChange} value={formData.temporaryAddress} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
              <div className='sm:w-1/2'>
                <p>Permanent Address</p>
                <input name="permanentAddress" onChange={handleChange} value={formData.permanentAddress} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
            </div>

            {/* Row 4: Gender + Birthday */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>Gender</p>
                <select
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                  required
                  className='border border-black rounded w-full p-2 mt-1 bg-white'
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className='sm:w-1/2'>
                <p>Birthday</p>
                <input
                  name="birthday"
                  onChange={handleChange}
                  value={formData.birthday}
                  required
                  className='border border-black rounded w-full p-2 mt-1'
                  type='date'
                />
              </div>
            </div>

            {/* Row 5: Passwords */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>Password</p>
                <input name="password" onChange={handleChange} value={formData.password} required className='border border-black rounded w-full p-2 mt-1' type='password' />
              </div>
              <div className='sm:w-1/2'>
                <p>Confirm Password</p>
                <input name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} required className='border border-black rounded w-full p-2 mt-1' type='password' />
              </div>
            </div>
          </>
        ) : (
          /* =================== LOGIN FIELDS =================== */
          <>
            <div className='w-full text-lg'>
              <p>Email</p>
              <input name="email" onChange={handleChange} value={formData.email} required className='border border-black rounded w-full p-2 mt-1' type='email' />
            </div>
            <div className='w-full text-lg'>
              <p>Password</p>
              <input name="password" onChange={handleChange} value={formData.password} required className='border border-black rounded w-full p-2 mt-1' type='password' />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button type="submit" className='bg-green-500 text-white w-full py-2 rounded-md text-lg mt-2'>
          {state}
        </button>

        {/* Toggle Form Type */}
        {state === 'Login' ? (
          <p className='text-center'>Create a new account? <span onClick={() => setState('Sign Up')} className='text-cyan-600 underline cursor-pointer'>Click here</span></p>
        ) : (
          <p className='text-center'>Already have an account? <span onClick={() => setState('Login')} className='text-cyan-600 underline cursor-pointer'>Login here</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;