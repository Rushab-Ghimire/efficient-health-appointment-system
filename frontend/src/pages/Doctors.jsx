import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className='px-4 sm:px-10 py-6'>
      
      <p className='text-gray-600 text-lg mb-4'>Browse through the doctors specialist.</p>
      <SearchBar />
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>


        {/* Sidebar Specialties */}
       <div className={`${showFilter ? 'flex' : 'hidden sm:flex'} flex-col gap-4 text-sm text-gray-600 w-full sm:w-60`}>

          <p
            onClick={() =>
              speciality === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'General physician' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist')
            }
            className={`pl-4 py-2 pr-4 border border-gray-300 rounded-md transition-all cursor-pointer hover:bg-indigo-50 ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
          >
            Gastroenterologist
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='bg-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg cursor-pointer hover:-translate-y-1 transform transition duration-300 overflow-hidden group'
              key={index}
            >
                 <div className='w-full aspect-[4/3] bg-blue-50'>
                <img
                  className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className='p-4 space-y-1'>
                <div className='flex items-center gap-2 text-sm text-green-600 mb-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                  <span className='font-medium'>Available</span>
                </div>
                <p className='text-lg font-semibold text-gray-800'>{item.name}</p>
                <p className='text-sm text-indigo-600'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;

