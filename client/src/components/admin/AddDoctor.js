import React, { useState } from 'react';
import './AddDoctor.css';
const AddDoctor = () => {
  const [doctorDetails, setDoctorDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    departmentId: '',
    email: '',
    contactNumber: '',
    salary: '',
    gender: '',
    password: '1234@Abcd',
    shift: '',
    experience: '',
    specialization: '',
    appointmentFee: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails({ ...doctorDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/addDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorDetails),
      });

      if (response.ok) {
        console.log('Doctor details added successfully!');
        alert('Doctor details added successfully!');
        setDoctorDetails({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          departmentId: '',
          email: '',
          contactNumber: '',
          salary: '',
          gender: '',
          password: '',
          shift: '',
          experience: '',
          specialization: '',
          appointmentFee: '',
        });
      } else {
        console.error('Failed to add doctor details:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding doctor details:', error.message);
    }
  };


  return (
    <div className="add-doctor-form">
      <h3>Add Doctor</h3>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={doctorDetails.firstName} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={doctorDetails.lastName} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateOfBirth" value={doctorDetails.dateOfBirth} onChange={handleChange} />
        </label>
        <label>
          Department ID:
          <input type="number" name="departmentId" value={doctorDetails.departmentId} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={doctorDetails.email} onChange={handleChange} />
        </label>
        <label>
          Contact Number:
          <input type="text" name="contactNumber" value={doctorDetails.contactNumber} onChange={handleChange} />
        </label>
        <label>
          Salary:
          <input type="number" name="salary" value={doctorDetails.salary} onChange={handleChange} />
        </label>
        <label>
          Gender:
          <input type="text" name="gender" value={doctorDetails.gender} onChange={handleChange} />
        </label>
        
        <label>
          Shift:
          <input type="text" name="shift" value={doctorDetails.shift} onChange={handleChange} />
        </label>
        <label>
          Experience:
          <input type="number" name="experience" value={doctorDetails.experience} onChange={handleChange} />
        </label>
        <label>
          Specialization:
          <input type="text" name="specialization" value={doctorDetails.specialization} onChange={handleChange} />
        </label>
        <label>
          Appointment Fee:
          <input type="number" name="appointmentFee" value={doctorDetails.appointmentFee} onChange={handleChange} />
        </label>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
