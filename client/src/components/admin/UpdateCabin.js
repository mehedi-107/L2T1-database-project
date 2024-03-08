import React, { useState, useEffect } from 'react';

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
    NURSE_ID_2: ''
  });

  useEffect(() => {
    // Fetch available doctors and nurses when component mounts
    const fetchAvailableDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/availableDoctors');
        const data = await response.json();
        setAvailableDoctors(data);
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

    try {
      // Check if the doctor ID for day and night shifts are different
      if (updatedCabinDetails.DOCTOR_ID_DAY === updatedCabinDetails.DOCTOR_ID_NIGHT) {
        console.error('Error: Doctor ID for day and night shifts should be different');
        // Optionally, you can display an error message to the user
        return;
      }

      // Check if the nurse IDs are different
      if (updatedCabinDetails.NURSE_ID_1 === updatedCabinDetails.NURSE_ID_2) {
        console.error('Error: Nurse IDs should be different');
        // Optionally, you can display an error message to the user
        return;
      }

      // Send the updated cabin details to the server
      const response = await fetch(`http://localhost:5000/updateCabinDetails/${cabinDetails.CABIN_ID}`, {
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
          <p>Patient ID: {cabinDetails.PATIENT_ID}</p>
          <p>Cabin Type: {cabinDetails.CABIN_TYPE}</p>
          <p>
            Doctor ID (Day):{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.DOCTOR_ID_DAY}
                onChange={handleDoctorChange('DOCTOR_ID_DAY')}
              >
                <option value="">Select Doctor</option>
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
          <p>
            Doctor ID (Night):{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.DOCTOR_ID_NIGHT}
                onChange={handleDoctorChange('DOCTOR_ID_NIGHT')}
              >
                <option value="">Select Doctor</option>
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
          <p>
            Nurse ID 1:{' '}
            {editMode ? (
              <select
                value={updatedCabinDetails.NURSE_ID_1}
                onChange={handleNurseChange('NURSE_ID_1')}
              >
                <option value="">Select Nurse</option>
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
                <option value="">Select Nurse</option>
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
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateCabin;