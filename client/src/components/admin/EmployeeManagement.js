import React, { useState } from 'react';
import './EmployeeManagement.css'; // You can define styles for EmployeeManagement component here

const EmployeeManagement = () => {
  const [employeeId, setEmployeeId] = useState(''); // State to store the employee ID

  const handleChange = (e) => {
    setEmployeeId(e.target.value); // Update the employee ID as the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/remove/${employeeId}`, {
        method: 'POST', // Send a DELETE request to remove the employee
      });

      if (response.ok) {
        alert('Employee removed successfully!');
        setEmployeeId(''); // Clear the employee ID field
      } else {
        console.error('Failed to remove employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing employee:', error.message);
    }
  };

  return (
    <div className="employee-management-form">
      <h3>Remove Employee</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Employee ID:
          <input type="text" value={employeeId} onChange={handleChange} />
        </label>
        <button type="submit">Remove Employee</button>
      </form>
    </div>
  );
};

export default EmployeeManagement;
