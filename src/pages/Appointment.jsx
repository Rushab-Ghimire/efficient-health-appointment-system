import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId); 
    setDocInfo(docInfo);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  return docInfo && (
    <div>
      {/* ---------Doctor Details -----------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-blue-500 w-full' src={docInfo.image} alt={docInfo.name} />
        </div>

        <div>
          {/* Doc Info: name, degree, experience */}
          <p>
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" />
          </p>
          <div>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button>{docInfo.experience}</button>
          </div>

          {/*------- Doctor About --------*/}
          <div>
            <p>About</p>
            <p>{docInfo.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
