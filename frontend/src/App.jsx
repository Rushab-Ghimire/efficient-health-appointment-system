// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RequireStaff from './components/RequireStaff';

// Page Imports
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import VerificationPage from './pages/VerificationPage';

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
      <Footer />
    </div>
  );
};

export default App;
