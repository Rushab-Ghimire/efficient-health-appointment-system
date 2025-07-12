import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

// It's good practice to define initial state outside the component
// to reuse it for resetting the form.
const initialFormData = {
  username: '', 
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  temporaryAddress: '',
  permanentAddress: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState(initialFormData);
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // A helper function to reset form state when toggling
  const toggleFormState = (newState) => {
    setState(newState);
    setFormData(initialFormData); // Clear form fields on toggle
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const loginUrl = '/auth/custom-login/'; 
    const registerUrl = '/users/';

    // Add validation for password confirmation
    if (state === 'Sign Up' && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return; // Stop the form submission
    }

    // FIX: The if/else logic must be inside the try...catch block.
    try {
      if (state === 'Login') {
        // --- LOGIN LOGIC ---
        const response = await apiClient.post(loginUrl, {
          // Send the email value as the username, which is what your backend expects
          username: formData.email,
          password: formData.password,
        });
        login(response.data.token, response.data.user);
        navigate('/');

      } else { // --- SIGN UP LOGIC ---
        // 1. Prepare payload for registration
        const registerPayload = {
          username: formData.email, // Use email as username by default
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          temporary_address: formData.temporaryAddress,
          permanent_address: formData.permanentAddress,
          password: formData.password,
          password_confirm: formData.confirmPassword, // Backend might use this for validation
          role: 'patient' // Hard-code the role for all new sign-ups
        };

        // 2. Register the new user
        await apiClient.post(registerUrl, registerPayload);

        // 3. Automatically log them in after successful registration
        const loginResponse = await apiClient.post(loginUrl, {
          username: formData.email,
          password: formData.password,
        });
        
        login(loginResponse.data.token, loginResponse.data.user);
        navigate('/');
      }
    } catch (error) {
      // Improved error handling to be more robust
      console.error(`${state} failed`, error.response?.data);
      const errorData = error.response?.data;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (errorData) {
        // This flattens and joins all error messages from the backend
        errorMessage = Object.values(errorData).flat().join('\n');
      }
      alert(`${state} failed:\n${errorMessage}`);
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-4 m-auto p-8 min-w-[340px] sm:min-w-[500px] border rounded-xl text-black text-sm shadow-lg'>
        <p className='text-3xl text-black text-center font-semibold'>{state}</p>
        
        {/* Conditional Rendering for Form Fields (No changes here, this part is well-structured) */}
        {state === 'Sign Up' ? (
          <>
            {/* --- Row 1: First Name & Last Name --- */}
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

            {/* --- Row 2: Email & Phone Number --- */}
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
            
            {/* --- Row 3: Temporary & Permanent Address --- */}
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
            
            {/* --- Row 4: Password & Confirm Password --- */}
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
              <p>Email (your username)</p>
              <input name="email" onChange={handleChange} value={formData.email} required className='border border-black rounded w-full p-2 mt-1' type='email' />
            </div>
            <div className='w-full text-lg'>
              <p>Password</p>
              <input name="password" onChange={handleChange} value={formData.password} required className='border border-black rounded w-full p-2 mt-1' type='password' />
            </div>
          </>
        )}

        {/* --- Submit Button --- */}
        <button type="submit" className='bg-green-500 text-white w-full py-2 rounded-md text-lg mt-2'>
          {state}
        </button>

        {/* --- Toggle between Login and Sign Up --- */}
        {state === 'Login' ? (
          // UPDATE: Use the new toggle function to also clear form fields
          <p>Create a new account? <span onClick={() => toggleFormState('Sign Up')} className='text-cyan-600 underline cursor-pointer'>Click here</span></p>
        ) : (
          // UPDATE: Use the new toggle function to also clear form fields
          <p>Already have an account? <span onClick={() => toggleFormState('Login')} className='text-cyan-600 underline cursor-pointer'>Login here</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;