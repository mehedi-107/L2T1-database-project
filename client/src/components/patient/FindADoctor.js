// FindADoctor.js

import React, { useState, useEffect } from 'react';
import './FindADoctor.css';
import DoctorCard from '../DoctorCard';

function FindADoctor({ patient }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change this value as per your requirement

  useEffect(() => {
    // Fetch doctors data from your database or API
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    // Fetch departments when the component mounts
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

  // Function to filter doctors based on department
  const filterDoctorsByDepartment = (department) => {
    if (!department) return doctors;
    return doctors.filter(doctor => String(doctor.DEPT_ID) === String(selectedDepartment));
  };

  // Function to filter doctors based on department and doctor name
  const filterDoctors = () => {
    let filteredDoctors = doctors;

    // Apply department filter if a department is selected
    if (selectedDepartment) {
      filteredDoctors = filterDoctorsByDepartment(selectedDepartment);
    }

    // Apply name filter if a doctor name is entered
    if (selectedDoctor) {
      filteredDoctors = filteredDoctors.filter(doctor => `${doctor.FIRST_NAME} ${doctor.LAST_NAME}`.includes(selectedDoctor));
    }

    return filteredDoctors;
  };

  // Function to handle department selection change
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1); // Reset page number when department changes
  };

  // Function to handle doctor name input change
  const handleDoctorNameChange = (e) => {
    setSelectedDoctor(e.target.value);
    setCurrentPage(1); // Reset page number when doctor name changes
  };

  // Logic to get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filterDoctors().slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="find-a-doctor">
      <div className="doctor-search">
        <h2>Find a Doctor</h2>
        <form>
          <div className="form-group">
            <label htmlFor="department1">Department:</label>
            <select className='department-select' id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
              <option value="">-- Select Department --</option>
              {departments.map(department => (
                <option key={department.DEPARTMENT_ID} value={department.DEPARTMENT_ID}>{department.DEPARTMENT_NAME}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="doctorName">Doctor's Name:</label>
            <input className='dcName' placeholder='Search By Doctor Name' type="text"  value={selectedDoctor} onChange={handleDoctorNameChange} />
          </div>
        </form>
      </div>
      <div className="doctor-list">
        {/* Display filtered list of doctors */}
        {currentDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.DOCTOR_ID}
            doctor={doctor}
            patient={patient}
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        <div className="page-navigation">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <span className="page-number">{currentPage}</span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filterDoctors().length / itemsPerPage)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default FindADoctor;
