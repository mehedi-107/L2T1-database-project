import React, { useState, useEffect } from 'react';

const AssignPatientToWard = () => {
  const [patientId, setPatientId] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch departments from the server
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAssignToWard = async () => {
    try {
      const url = `/admitPatient/${patientId}/${department}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const message = await response.text();
      
      // Display the message as an alert
      alert(message);
      
      // Clear the input fields
      setPatientId('');
      setDepartment('');
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
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept.DEPARTMENT_ID} value={dept.DEPARTMENT_NAME}>{dept.DEPARTMENT_NAME}</option>
        ))}
      </select>
      <button onClick={handleAssignToWard}>Assign</button>
    </div>
  );
};

export default AssignPatientToWard;
