// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// --- Combine and clean up all imports ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // For logged-in users
import RequireStaff from './components/RequireStaff';   // For staff/admins only

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import VerificationPage from './pages/VerificationPage';
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
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/ai-doctor-finder" element={<AIDoctorFinder />} />

          {/* =================================================== */}
          {/*           Protected Routes (for Logged-in Users)    */}
          {/* =================================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointments />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
          </Route>

          {/* =================================================== */}
          {/*         Protected Routes (for Staff/Admins Only)    */}
          {/* =================================================== */}
          <Route element={<RequireStaff />}>
            <Route path="/staff/verify" element={<VerificationPage />} />
          </Route>
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;