// src/App.jsx - FINAL CORRECT VERSION
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // <-- The gatekeeper

// Page Imports
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import Settings from './pages/Settings';

const App = () => {
  return (
    <div> {/* No <Router> or <BrowserRouter> here! */}
      <Navbar />
      <Routes>
        {/* --- Public Routes (Anyone can access) --- */}
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        {/* --- Protected Routes (Must be logged in to access) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;