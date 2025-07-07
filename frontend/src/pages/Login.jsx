// pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Use axios for this one-off auth call

const Login = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient', // Default role for sign-up
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
      <div className='flex flex-col gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state}</p>
        <p>Please {state === 'Sign Up' ? 'Sign Up' : 'Log in'} to book an appointment</p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Email</p>
            <input name="email" onChange={handleChange} value={formData.email} required className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' />
          </div>
        )}

        <div className='w-full'>
          <p>Username</p>
          <input name="username" onChange={handleChange} value={formData.username} required className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input name="password" onChange={handleChange} value={formData.password} required className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' />
        </div>

        <button type="submit" className='bg-blue-600 text-white w-full py-2 rounded-md text-base'>
          {state}
        </button>

        {state === 'Login' ? (
          <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-blue-600 underline cursor-pointer'>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 underline cursor-pointer'>Login here</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;