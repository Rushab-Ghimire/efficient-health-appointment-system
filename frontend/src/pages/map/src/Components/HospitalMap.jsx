
import React, { useState, useEffect } from 'react'; // useEffect is needed for the new logic
import { MapContainer, TileLayer, Polyline, Tooltip, ZoomControl } from 'react-leaflet';
import hospitalPaths from '../Data/Hospitalpaths';
import 'leaflet/dist/leaflet.css';
import AnimatedPath from './AnimatedPath';

import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
import { useSearchParams } from 'react-router-dom';



// --- ICONS (Unchanged) ---
import { FaMapMarkerAlt, FaRoute, FaUserMd } from 'react-icons/fa';
import { MdElevator, MdStairs } from 'react-icons/md';
import { FaRegCircleDot } from 'react-icons/fa6';
import { IoShareOutline, IoPrintOutline } from 'react-icons/io5';
import { FiMenu, FiX } from 'react-icons/fi';


// --- [CHANGED] Expanded the internal paths data with more wards ---
const internalPaths = {
  "Building 1": {
    "Cardiology": [
      { type: 'straight', text: 'Enter the main lobby.' },
      { type: 'elevator', text: 'Take the elevator to the 2nd Floor.' },
      { type: 'left', text: 'Turn left and follow the blue line on the floor.' },
      { type: 'ward', text: 'Cardiology reception is on your right.' }
    ],
    "Neurology Clinic (1st Floor)": [
      { type: 'straight', text: 'Enter the main lobby.' },
      { type: 'stairs', text: 'Take the stairs on your right to the 1st Floor.' },
      { type: 'right', text: 'Turn right at the top of the stairs.' },
      { type: 'ward', text: 'Neurology Clinic is at the end of the hallway.' }
    ],
    "Pediatrics Ward (3rd Floor)": [
      { type: 'straight', text: 'Enter the main lobby.' },
      { type: 'elevator', text: 'Take the elevator to the 3rd Floor.' },
      { type: 'straight', text: 'Proceed straight into the brightly colored wing.' },
      { type: 'ward', text: 'Pediatrics Ward reception is ahead.' }
    ],
  },
  "Building 2": {
    "Orthopedics (Ground Floor)": [
      { type: 'right', text: 'Enter and take an immediate right.' },
      { type: 'straight', text: 'Follow the hallway to the end.' },
      { type: 'ward', text: 'Orthopedics is Room G12 on your left.' }
    ],
    "Dermatology (2nd Floor)": [
      { type: 'straight', text: 'Enter and proceed to the central elevators.' },
      { type: 'elevator', text: 'Take the elevator to the 2nd Floor.' },
      { type: 'left', text: 'Turn left; the clinic is the third door on the right.' },
      { type: 'ward', text: 'Arrive at Dermatology, Suite 250.' }
    ],
    "Radiology (Basement)": [
      { type: 'straight', text: 'Enter and find the main stairwell ahead.' },
      { type: 'stairs', text: 'Go down one flight of stairs to the Basement.' },
      { type: 'straight', text: 'Follow signs for Imaging & Radiology.' },
      { type: 'ward', text: 'Radiology reception is through the double doors.' }
    ],
    "Oncology Clinic (3rd Floor)": [
      { type: 'straight', text: 'Enter and proceed to the central elevators.' },
      { type: 'elevator', text: 'Take the elevator to the 3rd Floor.' },
      { type: 'right', text: 'Turn right; follow the hallway to the west wing.' },
      { type: 'ward', text: 'Oncology Clinic is at the end of the hall.' }
    ],
  },
  "Building 3": {
    "General Surgery (2nd Floor)": [
      { type: 'straight', text: 'Enter through the west entrance.' },
      { type: 'stairs', text: 'Take stairs immediately to your left to the 2nd Floor.' },
      { type: 'straight', text: 'Proceed straight into the West Wing.' },
      { type: 'ward', text: 'General Surgery reception is at the end of the hall.' }
    ],
    "ENT Clinic (1st Floor)": [
      { type: 'straight', text: 'Enter through the west entrance.' },
      { type: 'stairs', text: 'Take stairs immediately to your left to the 1st Floor.' },
      { type: 'right', text: 'Turn right and the clinic is halfway down the hall.' },
      { type: 'ward', text: 'Arrive at the ENT Clinic.' }
    ],
    "Physical Therapy (Ground Floor)": [
      { type: 'straight', text: 'Enter through the west entrance.' },
      { type: 'left', text: 'Turn left and follow the hallway around the corner.' },
      { type: 'straight', text: 'Proceed past the cafe.' },
      { type: 'ward', text: 'Physical Therapy gym is on your right.' }
    ],
  },
};

const DirectionIcon = ({ type }) => {
  const iconStyle = "text-white bg-blue-600 rounded-full p-2 flex-shrink-0";
  switch (type) {
    case 'start': return <FaRegCircleDot size={32} className={iconStyle} />;
    case 'path': return <FaRoute size={32} className={iconStyle} />;
    case 'destination': return <FaMapMarkerAlt size={32} className={iconStyle} />;
    case 'ward': return <FaUserMd size={32} className={iconStyle} />;
    case 'straight': return <FaRoute size={32} className={iconStyle} />;
    case 'left': return <svg width="32" height="32" viewBox="0 0 24 24" className={iconStyle} fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>;
    case 'right': return <svg width="32" height="32" viewBox="0 0 24 24" className={iconStyle} fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>;
    case 'elevator': return <MdElevator size={32} className={iconStyle} />;
    case 'stairs': return <MdStairs size={32} className={iconStyle} />;
    default: return <FaRoute size={32} className={iconStyle} />;
  }
};

const InternalPathVisualizer = ({ pathSteps }) => {
  return (
    <div className="p-4 pl-6 relative">
      <div className="absolute top-8 bottom-8 left-[35px] w-0.5 bg-gray-300" />
      {pathSteps.map((step, index) => (
        <div key={index} className="flex items-center mb-4 relative z-10">
          <DirectionIcon type={step.type} />
          <p className="ml-4 text-gray-700">{step.text}</p>
        </div>
      ))}
    </div>
  );
};

// --- [CHANGED] The DirectionsSidebar component has new state and logic ---
const DirectionsSidebar = ({ source, destination, onSourceChange, onDestinationChange, buildingNames, distance, onClose, initialWard }) => {
  const [availableWards, setAvailableWards] = useState([]);
  const [selectedWardPath, setSelectedWardPath] = useState(null);
  const navigate = useNavigate();


  // This effect updates the list of available wards when the destination changes
  useEffect(() => {
    if (destination && internalPaths[destination]) {
      setAvailableWards(Object.keys(internalPaths[destination]));
    } else {
      setAvailableWards([]);
    }
    // Always reset the selected ward when the main destination changes
    setSelectedWardPath(null);
  }, [destination]);

  useEffect(() => {
    if (destination && initialWard && internalPaths[destination]?.[initialWard]) {
      handleWardClick(initialWard);
    }
  }, [destination, initialWard]);

  const handleWardClick = (wardName) => {
    const pathSteps = internalPaths[destination][wardName];
    setSelectedWardPath({ name: wardName, steps: pathSteps });
  };



  const estimatedTime = (distance * 12).toFixed(0);
  const getDynamicSteps = () => {
    if (!source || !destination) return [];
    return [
      { type: 'start', instruction: `Start at ${source}` },
      { type: 'path', instruction: 'Follow the highlighted path on the map.' },
      { type: 'destination', instruction: `Arrive at ${destination}` },
    ];
  };
  const steps = getDynamicSteps();

  return (
    <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div><h1 className="text-xl font-bold text-gray-800">Hospital Navigator</h1><p className="text-sm text-gray-500">Select a start and end point.</p></div>

        <button
          onClick={() => navigate('/')} // On click, navigate to the homepage
          className="absolute top-5 right-5 z-[1000] bg-cyan-500 text-white font-bold py-3 px-6 rounded-full shadow-xl hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        >
          Exit Navigator
        </button>

        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close sidebar"><FiX size={24} /></button>
      </div>
      <div className="p-4 bg-gray-50 border-b space-y-4">
        <div>
          <label htmlFor="source-select" className="block text-sm font-bold text-gray-700 mb-1">STARTING POINT</label>
          <select id="source-select" value={source || ''} onChange={(e) => onSourceChange(e.target.value || null)} className="w-full border rounded p-2 bg-white"><option value="">-- Select Starting Point --</option>{buildingNames.map((name, i) => (<option key={`src-${i}`} value={name}>{name}</option>))}</select>
        </div>
        <div>
          <label htmlFor="destination-select" className="block text-sm font-bold text-gray-700 mb-1">DESTINATION</label>
          <select id="destination-select" value={destination || ''} onChange={(e) => onDestinationChange(e.target.value || null)} className="w-full border rounded p-2 bg-white" disabled={!source}><option value="">-- Select Destination --</option>{buildingNames.map((name, i) => (source !== name && <option key={`dest-${i}`} value={name}>{name}</option>))}</select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {destination && source ? (
          <div>
            <div className="px-4 py-3 border-b"><div className="flex items-center justify-between"><div><p className="text-2xl font-bold text-blue-700">~{estimatedTime} min <span className="text-lg text-gray-500 font-medium">({distance} km)</span></p><p className="text-sm text-green-600 font-medium">Fastest route available</p></div><div className="flex space-x-4"><IoShareOutline size={22} className="text-blue-600 cursor-pointer" /><IoPrintOutline size={22} className="text-blue-600 cursor-pointer" /></div></div></div>
            <ul className="divide-y divide-gray-200">{steps.map((step, index) => (<li key={index} className="flex items-center p-4"><div className="mr-4"><DirectionIcon type={step.type} /></div><p className="text-base text-gray-800 font-medium">{step.instruction}</p></li>))}</ul>

            {/* --- [NEW] Section for selecting a ward --- */}
            {availableWards.length > 0 && (
              <div className="border-t-2 border-dashed border-gray-300 mt-2 p-4">
                <h3 className="text-md font-bold text-gray-800 mb-3">Wards in {destination}:</h3>
                <div className="flex flex-col space-y-2">
                  {availableWards.map(ward => (
                    <button
                      key={ward}
                      onClick={() => handleWardClick(ward)}
                      className={`p-2 text-left rounded-md transition ${selectedWardPath?.name === ward ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                      {ward}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- [CHANGED] This now only shows AFTER a ward is selected --- */}
            {selectedWardPath && (
              <div className="border-t border-gray-300 mt-2">
                <h3 className="text-md font-bold text-gray-800 p-4 pb-0">Directions to: <br /> <span className="text-blue-600">{selectedWardPath.name}</span></h3>
                <InternalPathVisualizer pathSteps={selectedWardPath.steps} />
              </div>
            )}
          </div>
        ) : (<div className="p-8 text-center text-gray-500"><p>Please select a starting point and a destination to view the route.</p></div>)}
      </div>
    </div>
  );
};


// --- The MAIN HospitalMap component remains UNCHANGED ---
const HospitalMap = () => {
  const [searchParams] = useSearchParams();
  const initialSource = searchParams.get('start') || null;
  const initialDestination = searchParams.get('destination') || null;
  const initialWard = searchParams.get('ward') || null;

  // --- 3. INITIALIZE STATE WITH URL PARAMETERS ---
  const [sourcePoint, setSourcePoint] = useState(initialSource);
  const [destinationPoint, setDestinationPoint] = useState(initialDestination);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const buildingNames = ["Building 3", "Main Gate", "Building 1", "Building 2", "Hospital Pharmacy", "Hospital Canteen", "Gate 2", "BPKIHS"];
  const center = [26.8120, 87.2689];
  const calculateDistance = (coords) => {
    let distance = 0;
    for (let i = 1; i < coords.length; i++) {
      const [lat1, lon1] = coords[i - 1]; const [lat2, lon2] = coords[i];
      const R = 6371; const dLat = (lat2 - lat1) * (Math.PI / 180); const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); distance += R * c;
    }
    return distance.toFixed(2);
  };

  const buildingFeatures = hospitalPaths.features.filter(f => buildingNames.includes(f.properties.name));

  const activePath = hospitalPaths.features.find(f => {
    const forward = f.properties.source === sourcePoint && f.properties.destination === destinationPoint;
    const reverse = f.properties.source === destinationPoint && f.properties.destination === sourcePoint;
    return forward || reverse;
  });

  const currentDistance = activePath ? calculateDistance(activePath.geometry.coordinates.map(([lng, lat]) => [lat, lng])) : '0.00';

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gray-100 font-sans">
      <div className={`absolute top-0 left-0 h-full z-[1000] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <DirectionsSidebar
          source={sourcePoint}
          destination={destinationPoint}
          initialWard={initialWard}
          onSourceChange={(value) => { setSourcePoint(value); setDestinationPoint(null); }}
          onDestinationChange={setDestinationPoint}
          buildingNames={buildingNames}
          distance={currentDistance}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className="flex-1 h-full">
        <div className="relative h-full w-full">
          {!isSidebarOpen && (<button onClick={() => setIsSidebarOpen(true)} className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-md shadow-lg text-gray-700 hover:bg-gray-100 transition" aria-label="Open sidebar"><FiMenu size={24} /></button>)}



          <MapContainer center={center} zoom={18} scrollWheelZoom={true} className="h-full w-full" zoomControl={false}>
            <ZoomControl position="topright" />
            <TileLayer attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {buildingFeatures.map((feature, index) => (
              <Polyline key={`bldg-${index}`} positions={feature.geometry.coordinates.map(([lng, lat]) => [lat, lng])} pathOptions={{ color: '#2b6cb0', weight: 4, opacity: 0.9 }}>
                <Tooltip permanent>{feature.properties.name}</Tooltip>
              </Polyline>
            ))}

            {activePath && (() => {
              const originalCoords = activePath.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
              const pathIsReversed = activePath.properties.source !== sourcePoint;
              const finalCoords = pathIsReversed ? [...originalCoords].reverse() : originalCoords;

              return (
                <AnimatedPath
                  key={`${sourcePoint}-${destinationPoint}`}
                  positions={finalCoords}
                >
                  <Tooltip permanent>{`${sourcePoint} → ${destinationPoint}`}</Tooltip>
                </AnimatedPath>
              );
            })()}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;






