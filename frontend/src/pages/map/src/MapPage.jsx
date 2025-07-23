// src/pages/Map/MapPage.jsx

import React from 'react';
import HospitalMap from './Components/HospitalMap'; // Adjust path if needed
import './index.css';

const MapPage = () => {
  // The HospitalMap component itself is already designed to be full-screen,
  // so we don't need a wrapper around it. We just render it directly.
  return (
    <HospitalMap />
  );
};

export default MapPage;