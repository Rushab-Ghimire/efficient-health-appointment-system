import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireStaff = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If not logged in or not staff, redirect to login
  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireStaff;
