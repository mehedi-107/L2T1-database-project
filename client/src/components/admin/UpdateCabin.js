import React, { useState, useEffect } from 'react';
import './UpdateCabin.css';

const UpdateCabin = () => {
  const [cabinId, setCabinId] = useState('');
  const [cabinDetails, setCabinDetails] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedCabinDetails, setUpdatedCabinDetails] = useState({
    DOCTOR_ID_DAY: '',
    DOCTOR_ID_NIGHT: '',
    NURSE_ID_1: '',
    NURSE_ID_2: '',
  });

  useEffect(() => {
    // Fetch available doctors and nurses when component mounts
    const fetchAvailableDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/availableDoctors');
        const data = await response.json();
        setAvailableDoctors(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching available doctors:', error);
      }
    };

    const fetchAvailableNurses = async () => {
      try {
        const response = await fetch('http://localhost:5000/availableNurses');
        const data = await response.json();
        setAvailableNurses(data);
      } catch (error) {
        console.error('Error fetching available nurses:', error);
      }
    };

    fetchAvailableDoctors();
    fetchAvailableNurses();
  }, []);

  const handleSearch = async () => {
    try {
      console.log(cabinId);
      const response = await fetch(`http://localhost:5000/cabinDetails/${cabinId}`);
      const data = await response.json();
      console.log(data);
      setCabinDetails(data);
    } catch (error) {
      console.error('Error fetching cabin details:', error);
    }
  };

  const handleDoctorChange = (field) => (e) => {
    setUpdatedCabinDetails({ ...updatedCabinDetails, [field]: e.target.value });
  };

  const handleNurseChange = (field) => (e) => {
    setUpdatedCabinDetails({ ...updatedCabinDetails, [field]: e.target.value });
  };

  const handleSave = async () => {
    setEditMode(false);

    if(updatedCabinDetails.DOCTOR_ID_DAY ==='')
    updatedCabinDetails.DOCTOR_ID_DAY = cabinDetails.DOCTOR_ID_DAY;
    if(updatedCabinDetails.DOCTOR_ID_NIGHT ==='')
    updatedCabinDetails.DOCTOR_ID_NIGHT = cabinDetails.DOCTOR_ID_NIGHT;
    
    if(updatedCabinDetails.NURSE_ID_1 ==='')
    updatedCabinDetails.NURSE_ID_1 = cabinDetails.NURSE_ID_1;
    
    if(updatedCabinDetails.NURSE_ID_2 ==='')
    updatedCabinDetails.NURSE_ID_2 = cabinDetails.NURSE_ID_2;
    console.log(updatedCabinDetails);
    
  updatedCabinDetails.DOCTOR_ID_DAY= parseInt(updatedCabinDetails.DOCTOR_ID_DAY);
  updatedCabinDetails.DOCTOR_ID_NIGHT= parseInt(updatedCabinDetails.DOCTOR_ID_NIGHT);
  updatedCabinDetails.NURSE_ID_1= parseInt(updatedCabinDetails.NURSE_ID_1);
  updatedCabinDetails.NURSE_ID_2= parseInt(updatedCabinDetails.NURSE_ID_2);

    
    try {
      // Send the updated cabin details to the server
      const response = await fetch(`http://localhost:5000/updateCabinDetails/${cabinId}`, {
        method: 'PUT', // or 'POST'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCabinDetails),
      });

      if (!response.ok) {
        console.error('Error updating cabin details:', response.statusText);
        // Optionally, you can display an error message to the user
        return;
      }

      // Optionally, provide feedback to the user that changes were saved successfully
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      // Optionally, you can display an error message to the user
    }
  };

  const handleCheckout = async () => {
    try {
      // Send a request to checkout the patient from the cabin
      const response = await fetch(`http://localhost:5000/checkout/${cabinDetails.CABIN_ID}`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally, you can send additional data if required
      });

      if (!response.ok) {
        console.error('Error checking out patient:', response.statusText);
        // Optionally, you can display an error message to the user
        return;
      }

      // Optionally, provide feedback to the user that the patient was checked out successfully
      console.log('Patient checked out successfully');
    } catch (error) {
      console.error('Error checking out patient:', error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div className="cabin-card">
      <h3>Update Cabin Details</h3>
      <input
        type="text"
        placeholder="Cabin ID (101-140, 201-240, 301-340, 401-440, 501-540)"
        value={cabinId}
        onChange={(e) => setCabinId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {cabinDetails && (
        <>
          <h4>Cabin Details</h4>
          <p>Cabin ID: {cabinDetails.CABIN_NO}</p>
          <p>Floor No: {cabinDetails.FLOOR_NO}</p>
          <p>Patient Name: {cabinDetails.PATIENT_FIRST_NAME} {cabinDetails.PATIENT_LAST_NAME}</p> 
          <p>Patient ID: {cabinDetails.PATIENT_ID}</p>
          <p>Admission Reason: {cabinDetails.REASON}</p>
          <p>Cabin Type: {cabinDetails.CABIN_TYPE}</p>
          <p>
            Doctor ID (Day):{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.DOCTOR_ID_DAY}
                onChange={handleDoctorChange('DOCTOR_ID_DAY')}
              >
                <option value="">Available Doctors(Select One)</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                    {doctor.DOCTOR_NAME} - {doctor.DOCTOR_ID}
                  </option>
                ))}
              </select>
            ) : (
              <span>{cabinDetails.DOCTOR_ID_DAY}</span>
            )}
          </p>
          <p>Name of Doctor(Day): {cabinDetails.DAY_DOCTOR_FIRST_NAME}</p>
          <p>
            
            Doctor ID (Night):{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.DOCTOR_ID_NIGHT}
                onChange={handleDoctorChange('DOCTOR_ID_NIGHT')}
              >
                <option value="">Available Doctors(Select One)</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                    {doctor.DOCTOR_NAME} - {doctor.DOCTOR_ID}
                  </option>
                ))}
              </select>
            ) : (
              <span>{cabinDetails.DOCTOR_ID_NIGHT}</span>
            )}
          </p>
          <p>Name of Doctor(Night): {cabinDetails.NIGHT_DOCTOR_FIRST_NAME}</p>
          <p>
            Nurse ID 1:{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.NURSE_ID_1}
                onChange={handleNurseChange('NURSE_ID_1')}
              >
                <option value="">Available Nurses</option>
                {availableNurses.map((nurse) => (
                  <option key={nurse.NURSE_ID} value={nurse.NURSE_ID}>
                    {nurse.NURSE_NAME}-{nurse.NURSE_ID}
                  </option>
                ))}
              </select>
            ) : (
              <span>{cabinDetails.NURSE_ID_1}</span>
            )}
          </p>
          <p>
            Nurse ID 2:{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.NURSE_ID_2}
                onChange={handleNurseChange('NURSE_ID_2')}
              >
                <option value="">Available Nurses</option>
                {availableNurses.map((nurse) => (
                  <option key={nurse.NURSE_ID} value={nurse.NURSE_ID}>
                    {nurse.NURSE_NAME}-{nurse.NURSE_ID}
                  </option>
                ))}
              </select>
            ) : (
              <span> {cabinDetails.NURSE_ID_2}</span>
            )}
          </p>
          {editMode ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={handleCheckout}>Checkout Patient</button>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateCabin;
