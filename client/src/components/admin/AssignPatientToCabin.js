import React, { useState, useEffect } from 'react';

const AssignPatientToCabin = () => {
  const [patientId, setPatientId] = useState('');
  const [cabinType, setCabinType] = useState('');
  const [cabinTypes, setCabinTypes] = useState([]);

  useEffect(() => {
    const fetchCabinTypes = async () => {
      try {
        const response = await fetch('http://localhost:5000/cabinTypes');
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
      const response = await fetch(`http://localhost:5000/admitPatientToCabin/${patientId}/${cabinType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const message = await response.text();
      console.log(message);
      
      // Display the message
      alert(message);
      
      // Clear the input fields
      setPatientId('');
      setCabinType('');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
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
