// frontend/src/components/Myprofile.js

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext'; // Make sure this path is correct
import { assets } from '../assets/assets'; // Import your local assets


const Myprofile = () => {
    // Get the globally managed user, token, and the login function (to update state) from the context
    const { user, token, login } = useContext(AppContext);
    
    // Local state for managing the form while in "Edit Mode"
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(null);
    const [imageFile, setImageFile] = useState(null); // To hold the new image file for upload
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // This effect runs when the component loads or when the global 'user' object changes.
    // It populates our local form state with the latest user data.
    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    // Handler for all text/select/date input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for when a new image file is selected
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Create a temporary local URL to show a preview of the new image
            setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };
    
    // Handler for saving the updated profile to the backend
    const handleSave = async () => {
        if (!formData || !user) return;
        setLoading(true);
        setError('');
        setSuccess('');

        const formPayload = new FormData();
        // Append all the fields that can be edited
        formPayload.append('first_name', formData.first_name);
        formPayload.append('last_name', formData.last_name);
        formPayload.append('phone_number', formData.phone_number);
        formPayload.append('permanent_address', formData.permanent_address); // Assuming this is your main address field
        formPayload.append('gender', formData.gender);
        formPayload.append('date_of_birth', formData.date_of_birth);
        
        if (imageFile) {
            formPayload.append('image', imageFile);
        }

        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/users/${user.id}/`, formPayload, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            // Update the global user state with the fresh data from the server
            login(token, response.data); 
            
            setIsEdit(false);
            setImageFile(null);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            const errorData = err.response?.data;
            const errorMessage = errorData ? Object.values(errorData).flat().join(' ') : "Failed to save profile. Please try again.";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for cancelling the edit mode
    const handleCancel = () => {
        setIsEdit(false);
        setFormData(user); // Reset any changes back to the original user data
        setImageFile(null);
        setError('');
        setSuccess('');
    };

    // Show a loading message while the AppContext is fetching the user data
    if (!formData) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    // Combine first and last name for display
    const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim();
    const profileImage = formData.image || assets.default_avatar;


    // The main JSX, now connected to the dynamic formData state
    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-b from-white via-indigo-50 to-blue-100 px-4 py-10'>
            <div className='bg-white border border-blue-100 rounded-2xl shadow-lg p-8 w-full max-w-2xl flex flex-col gap-4 text-sm text-slate-700'>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-600 text-center mb-4">{success}</p>}

                {/* Profile Image & Name */}
                <div className='flex flex-col items-center'>
                    <img  className='w-28 h-28 rounded-full border-4 border-white shadow-md object-cover object-center' src={profileImage} alt="Profile" />
                    {isEdit && (
                        <div className="mt-2">
                            <label htmlFor="imageUpload" className="cursor-pointer text-blue-600 hover:underline">Change Photo</label>
                            <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                    )}
                    {isEdit ? (
                        <div className='flex gap-2 mt-4'>
                          <input name="first_name" value={formData.first_name} onChange={handleInputChange} className='text-xl font-semibold text-center bg-indigo-50 px-2 py-1 rounded-md' />
                          <input name="last_name" value={formData.last_name} onChange={handleInputChange} className='text-xl font-semibold text-center bg-indigo-50 px-2 py-1 rounded-md' />
                        </div>
                    ) : (
                        <p className='mt-4 text-3xl font-bold text-cyan-700'>{fullName}</p>
                    )}
                </div>

                <hr className='border-blue-200 my-2' />

                {/* Contact Info */}
                <div>
                    <p className='text-cyan-900 font-semibold underline mb-2'>CONTACT INFORMATION</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4 mt-2'>
                        <p className='font-medium'>Email:</p>
                        <p className='text-black'>{formData.email}</p>

                        <p className='font-medium'>Phone:</p>
                        {isEdit ? <input name="phone_number" value={formData.phone_number || ''} onChange={handleInputChange} className='bg-indigo-50 rounded-md px-2 py-1 w-full' /> : <p className='text-black'>{formData.phone_number || 'N/A'}</p>}

                        <p className='font-medium'>Address:</p>
                        {isEdit ? <input name="permanent_address" value={formData.permanent_address || ''} onChange={handleInputChange} className='bg-indigo-50 rounded-md px-2 py-1 w-full' /> : <p className='text-black'>{formData.permanent_address || 'N/A'}</p>}
                    </div>
                </div>

                {/* Basic Info */}
                <div>
                    <p className='text-cyan-900 font-semibold underline mt-4 mb-2'>BASIC INFORMATION</p>
                    <div className='grid grid-cols-[1fr_3fr] gap-y-3 gap-x-4'>
                        <p className='font-medium'>Gender:</p>
                        {isEdit ? (
                            <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className='bg-indigo-50 px-2 py-1 rounded-md'>
                                <option value="">Select...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        ) : <p className='text-black capitalize'>{formData.gender || 'N/A'}</p>}

                        <p className='font-medium'>Date of Birth:</p>
                        {isEdit ? <input name="date_of_birth" value={formData.date_of_birth || ''} onChange={handleInputChange} type="date" className='bg-indigo-50 px-2 py-1 rounded-md' /> : <p className='text-black'>{formData.date_of_birth || 'N/A'}</p>}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-center mt-6'>
                    <button
                        className='px-8 py-2 border border-blue-900 text-black bg-green-400 font-medium rounded-full hover:bg-green-500 hover:text-white transition-all disabled:opacity-50'
                        onClick={() => isEdit ? handleSave() : setIsEdit(true)}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Save Information' : 'Edit Profile')}
                    </button>
                    {isEdit && <button onClick={handleCancel} className="ml-4 px-8 py-2 rounded-full hover:bg-gray-200">Cancel</button>}
                </div>
            </div>
        </div>
    );
};

export default Myprofile;