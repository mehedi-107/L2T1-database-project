import React, { useState, useEffect } from 'react';
import './AssignPatientToCabin.css';

const AssignPatientToCabin = () => {
  const [patientId, setPatientId] = useState('');
  const [cabinType, setCabinType] = useState('');
  const [cabinTypes, setCabinTypes] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchCabinTypes = async () => {
      try {
        const response = await fetch('/cabinTypes');
        const data = await response.json();
        setCabinTypes(data);
      } catch (error) {
        console.error('Error fetching cabin types:', error);
      }
    };

    fetchCabinTypes();
  }, []);

  const handleAssignToCabin = async () => {
    try {
      const response = await fetch(`/admitPatientToCabin/${patientId}/${cabinType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const message = await response.text();
      setPopupMessage(message); 
      
      
      setPatientId('');
      setCabinType('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closePopup = () => {
    setPopupMessage('');
  };

  return (
    <div>
      {popupMessage && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      <select value={cabinType} onChange={(e) => setCabinType(e.target.value)}>
        <option value="">Select Cabin Type</option>
        {cabinTypes.map((type, index) => (
          <option key={index} value={type.CABIN_TYPE}>{type.CABIN_TYPE}</option>
        ))}
      </select>
      <button onClick={handleAssignToCabin}>Assign</button>
    </div>
  );
};

export default AssignPatientToCabin;
