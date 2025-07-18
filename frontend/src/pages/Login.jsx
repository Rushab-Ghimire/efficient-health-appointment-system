// pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; // Use your configured apiClient

const initialFormData = {
  // --- CORRECTED: Use snake_case to match the Django API ---
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  temporary_address: '',
  permanent_address: '',
  password: '',
  password_confirm: '',
  gender: '',
  birthday: '',
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    // Reset form to the correct state when toggling
    setFormData(isLogin ? initialFormData : { username: '', password: '' });
  };

// In your Login.jsx component

const onSubmitHandler = async (event) => {
  event.preventDefault();
  
  // Define the ONE correct URL for logging in.
  const loginUrl = 'auth/custom-login/';
  const registerUrl = 'api/users/';

  try {
    if (isLogin) {
      // --- LOGIN LOGIC ---
      const response = await apiClient.post(loginUrl, {
        username: formData.username, // Can be username or email
        password: formData.password,
      });
      
      // Pass both token and user to the context
      login(response.data.token, response.data.user);
      navigate('/'); // Or navigate('/my-profile')

    } else { 
      // --- SIGN UP LOGIC ---
      if (formData.password !== formData.password_confirm) {
        alert("Passwords do not match!");
        return;
      }

      // 1. Register the new user (This part is correct)
      await apiClient.post(registerUrl, { ...formData, role: 'patient' });

      // 2. Automatically log them in using the CORRECT loginUrl
      const loginResponse = await apiClient.post(loginUrl, { // <-- FIX: Use loginUrl
        username: formData.username, // Use their new username
        password: formData.password,
      });
      
      // Pass both token and user to the context
      login(loginResponse.data.token, loginResponse.data.user);
      navigate('/'); // Or navigate('/my-profile')
    }
  } catch (error) {
    // Your error handling is good
    const errorData = error.response?.data;
    let errorMessage = 'An unexpected error occurred.';
    if (errorData) {
      errorMessage = Object.values(errorData).flat().join(' ');
    }
    alert(`Error: ${errorMessage}`);
    console.error(error);
  }
};
  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[500px] border rounded-xl text-black text-sm shadow-lg bg-white'>
        <p className='text-3xl text-black text-center font-semibold'>{isLogin ? 'Login' : 'Sign Up'}</p>
        {error && <p className="text-center text-red-500">{error}</p>}

        {isLogin ? (
          /* =================== LOGIN FIELDS =================== */
          <>
            <div className='w-full text-lg'>
              <p>Username or Email</p>
              <input name="username" onChange={handleChange} value={formData.username} required className='border border-black rounded w-full p-2 mt-1' type='text' />
            </div>
            <div className='w-full text-lg'>
              <p>Password</p>
              <input name="password" onChange={handleChange} value={formData.password} required className='border border-black rounded w-full p-2 mt-1' type='password' />
            </div>
          </>
        ) : (
          /* =================== SIGN UP FIELDS =================== */
          <>
            {/* Row 0: Username (Required by backend) */}
            <div className='w-full'>
              <p>Username</p>
              <input name="username" onChange={handleChange} value={formData.username} required className='border border-black rounded w-full p-2 mt-1' type='text' />
            </div>

            {/* Row 1: Name */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>First Name</p>
                <input name="first_name" onChange={handleChange} value={formData.first_name} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
              <div className='sm:w-1/2'>
                <p>Last Name</p>
                <input name="last_name" onChange={handleChange} value={formData.last_name} required className='border border-black rounded w-full p-2 mt-1' type='text' />
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
                <input name="phone_number" onChange={handleChange} value={formData.phone_number} required className='border border-black rounded w-full p-2 mt-1' type='tel' />
              </div>
            </div>

            {/* Row 3: Address */}
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className='sm:w-1/2'>
                <p>Temporary Address</p>
                <input name="temporary_address" onChange={handleChange} value={formData.temporary_address} required className='border border-black rounded w-full p-2 mt-1' type='text' />
              </div>
              <div className='sm:w-1/2'>
                <p>Permanent Address</p>
                <input name="permanent_address" onChange={handleChange} value={formData.permanent_address} required className='border border-black rounded w-full p-2 mt-1' type='text' />
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
                  <option value="male">Male</option>   {/* CORRECTED: lowercase */}
                  <option value="female">Female</option> {/* CORRECTED: lowercase */}
                  <option value="other">Other</option>   {/* CORRECTED: lowercase */}
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
                <input name="password_confirm" onChange={handleChange} value={formData.password_confirm} required className='border border-black rounded w-full p-2 mt-1' type='password' />
              </div>
            </div>
          </>
        )}

        <button type="submit" className='bg-green-500 text-white w-full py-2 rounded-md text-lg mt-2'>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className='text-center'>
          {isLogin ? 'Create a new account?' : 'Already have an account?'}
          <span onClick={toggleForm} className='text-cyan-600 underline cursor-pointer ml-1'>
            {isLogin ? 'Click here' : 'Login here'}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;