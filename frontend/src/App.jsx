// src/App.jsx

import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from './context/AppContext';

// --- Layout Components ---
import PublicLayout from './components/PublicLayout';
import StaffLayout from './components/StaffLayout';

// --- Route Protection Components ---
import ProtectedRoute from './components/ProtectedRoute';
import RequireStaff from './components/RequireStaff';

// --- Page Components ---
import Home from './pages/Home';
import Login from './pages/Login';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import VerificationPage from './pages/VerificationPage';
import AIDoctorFinder from './components/AIDoctorFinder';

const App = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // This effect handles the role-based redirect after a user logs in.
  useEffect(() => {
    if (user && location.pathname === '/login') {
      if (user.role === 'admin' || user.is_staff) {
        navigate('/staff/verify');
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else { // patient
        navigate('/my-profile');
      }
    }
  }, [user, navigate, location]);

  return (
    // The <Routes> component should be the top-level router component.
    <Routes>

      {/* --- Group 1: Public & General User Routes --- */}
      {/* All routes inside this group will share the PublicLayout (Navbar & Footer) */}
      <Route path="/" element={<PublicLayout />}>

        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="ai-doctor-finder" element={<AIDoctorFinder />} />

        {/* Protected Routes (for any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="my-appointments" element={<MyAppointments />} />
          <Route path="appointment/:docId" element={<Appointment />} />
        </Route>
      </Route>

      {/* --- Group 2: Staff-Only Routes --- */}
      {/* This group is protected by RequireStaff and uses the StaffLayout */}
      <Route path="/staff" element={<RequireStaff />}>
        <Route element={<StaffLayout />}>
          {/* path="verify" combines with the parent "/staff" to become "/staff/verify" */}
          <Route path="verify" element={<VerificationPage />} />
          {/* You can add more staff pages like a dashboard here */}
          {/* <Route path="dashboard" element={<StaffDashboard />} /> */}
        </Route>
      </Route>

    </Routes>
  );
};

export default App;