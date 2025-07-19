<<<<<<< HEAD
// src/App.jsx - FINAL CORRECTED VERSION

=======
// src/App.jsx
>>>>>>> e01b57980eac182b0278d366e2fa5b00da6856df
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// --- Step 1: Combine and clean up all imports ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
<<<<<<< HEAD
import ProtectedRoute from './components/ProtectedRoute'; // For logged-in users
import RequireStaff from './components/RequireStaff';   // For staff/admins only
=======
import ProtectedRoute from './components/ProtectedRoute';
import RequireStaff from './components/RequireStaff';
>>>>>>> e01b57980eac182b0278d366e2fa5b00da6856df

// Import all necessary pages
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import VerificationPage from './pages/VerificationPage';
<<<<<<< HEAD
import AIDoctorFinder from './components/AIDoctorFinder'; // Your new component

const App = () => {
  return (
    <div>
      <Navbar />
      <main className="main-content"> {/* Good practice to wrap content in a main tag */}
        <Routes>
          {/* =================================================== */}
          {/*                  Public Routes                      */}
          {/* =================================================== */}
          {/* These routes are accessible to anyone, logged in or not. */}

          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          
          {/* The AI Doctor Finder is a public feature */}
          <Route path="/ai-doctor-finder" element={<AIDoctorFinder />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
          </Route>

          {/* =================================================== */}
          {/*         Protected Routes (for Staff/Admins Only)      */}
          {/* =================================================== */}
          {/* The RequireStaff component will check if the logged-in user has */}
          {/* the 'admin' or 'doctor' role. */}

          <Route element={<RequireStaff />}>
            <Route path="/staff/verify" element={<VerificationPage />} />
            {/* You can add more staff-only routes here in the future */}
          </Route>
          
        </Routes>
      </main>
=======

const App = () => {
  return (
    <div> {/* No <Router> here — assumed wrapped higher up */}
      <Navbar />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        {/* --- Protected Routes (require login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
        </Route>

        {/* --- Staff-only Route --- */}
        <Route
          path='/staff/verify'
          element={
            <RequireStaff>
              <VerificationPage />
            </RequireStaff>
          }
        />
      </Routes>
>>>>>>> e01b57980eac182b0278d366e2fa5b00da6856df
      <Footer />
    </div>
  );
};

export default App;
