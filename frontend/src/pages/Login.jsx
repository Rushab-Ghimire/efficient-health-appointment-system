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
  date_of_birth: '',
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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




  // The final, correct onSubmitHandler for Login.jsx
  // In Login.jsx

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const loginUrl = 'auth/custom-login/';
    const registerUrl = 'api/users/';

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await apiClient.post(loginUrl, {
          username: formData.username,
          password: formData.password,
        });

        const { token, user } = response.data;

        // --- THIS IS THE KEY ---
        // We call the context's login function. This saves the data
        // to localStorage and updates the app's state for future renders.
        login(token, user);

        // --- And THEN we perform the redirect based on the fresh data ---
        if (user.role === 'admin' || user.is_staff) {
          navigate('/staff/verify');
        } else if (user.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/');
        }

      } else {
        // --- SIGN UP LOGIC ---
        if (formData.password !== formData.password_confirm) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }
        await apiClient.post(registerUrl, { ...formData, role: 'patient' });
        const loginResponse = await apiClient.post(loginUrl, {
          username: formData.username,
          password: formData.password,
        });

        const { token, user } = loginResponse.data;
        login(token, user);

        // A new patient always goes to their profile page
        navigate('/');
      }
    } catch (error) {
      // ... your error handling is perfect
      const errorData = error.response?.data;
      let errorMessage = 'An unexpected error occurred.';
      if (errorData) {
        errorMessage = Object.values(errorData).flat().join(' ');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
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
                  <option value="male">Male</option>  
                  <option value="female">Female</option> 
                  <option value="other">Other</option>   
                </select>
              </div>
              <div className='sm:w-1/2'>
                <p>Date of birth</p>
                <input
                  name="date_of_birth"
                  onChange={handleChange}
                  value={formData.date_of_birth}
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