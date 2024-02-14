// Patient.js
import React, { useState, useEffect } from 'react';
import './Patient.css';

import AppointmentForm from './AppointmentForm';

const Patient = ({ userData }) => {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showCabins, setShowCabins] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allocatedCabins, setAllocatedCabins] = useState([]);
  const [allocatedWards, setAllocatedWards] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appointments?patientId=${userData.user.PATIENT_ID}`);
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [userData.user.PATIENT_ID]);

  useEffect(() => {
    const fetchAllocatedCabins = async () => {
      try {
        const response = await fetch(`http://localhost:5000/allocatedCabins?patientId=${userData.user.PATIENT_ID}`);
        const data = await response.json();
        setAllocatedCabins(data);
      } catch (error) {
        console.error('Error fetching allocated cabins:', error);
      }
    };

    fetchAllocatedCabins();
  }, [userData.user.PATIENT_ID]);

  useEffect(() => {
    const fetchAllocatedWards = async () => {
      try {
        const response = await fetch(`http://localhost:5000/allocatedWards?patientId=${userData.user.PATIENT_ID}`);
        const data = await response.json();
        setAllocatedWards(data);
      } catch (error) {
        console.error('Error fetching allocated wards:', error);
      }
    };

    fetchAllocatedWards();
  }, [userData.user.PATIENT_ID]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`http://localhost:5000/doctors?department=${selectedDepartment}`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    if (selectedDepartment) {
      fetchDoctors();
    }
  }, [selectedDepartment]);

  const handleAppointmentsClick = () => {
    setShowAppointments(!showAppointments);
    setShowCabins(false);
    setShowWards(false);
  };

  const handleCabinsClick = () => {
    setShowCabins(!showCabins);
    setShowAppointments(false);
    setShowWards(false);
  };

  const handleWardsClick = () => {
    setShowWards(!showWards);
    setShowAppointments(false);
    setShowCabins(false);
  };

  const findAllocatedBed = (ward) => {
    for (let i = 1; i <= 10; i++) {
      const bedColumnName = `BED_${i}`;
      const patientId = ward[bedColumnName];

      if (patientId !== null) {
        return `Bed ${i}`;
      }
    }

    return 'Not Allocated';
  };

  const handleAppointmentSubmit = (doctorId, time) => {
    console.log('Submitting appointment:', { doctorId, time });
  };

  return (
    <div className='patient-container'>
      <div className="header">
        <h2>Patient Information</h2>
        <div className="patient-details">
          <div className="patient-image">
            {/* Add patient image here */}
          </div>
          <div className="patient-info">
            <p>User ID: {userData.user.PATIENT_ID}</p>
            <p>Name: {`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</p>
            <p>Email: {userData.user.EMAIL_ID}</p>
            <p>Date of Birth: {userData.user.DATE_OF_BIRTH}</p>
            <p>Contact Number: {userData.user.CONTACT_NO}</p>
            <p>Gender: {userData.user.GENDER}</p>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="button" onClick={handleAppointmentsClick}>
          {showAppointments ? 'Hide Appointments' : 'View Appointments'}
        </button>

        <button className="button" onClick={handleCabinsClick}>
          {showCabins ? 'Hide Cabins' : 'View Cabins'}
        </button>

        <button className="button" onClick={handleWardsClick}>
          {showWards ? 'Hide Wards' : 'View Wards'}
        </button>

        <button className="button request-appointment" onClick={() => setShowAppointmentForm(true)}>
          Request Appointment
        </button>
      </div>

      {showAppointments && (
        <div className="appointments">
          <h3>Upcoming Appointments</h3>
          <table>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Appointment Date</th>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.APPOINTMENT_ID}>
                  <td>{appointment.APPOINTMENT_ID}</td>
                  <td>{appointment.APPOINTMENT_DATE.split('T')[0]}</td>
                  <td>{appointment.DOCTOR_ID}</td>
                  <td>{`${appointment.FIRST_NAME} ${appointment.LAST_NAME}`}</td>
                  <td>{appointment.EMAIL}</td>
                  <td>{appointment.CONTACT_NO}</td>
                  <td>{appointment.START_TIME}</td>
                  <td>{appointment.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCabins && (
        <div className="cabins">
          <h3>Allocated Cabins</h3>
          <table>
            <thead>
              <tr>
                <th>Cabin Number</th>
                <th>Cabin Type</th>
                <th>Day Doctor ID</th>
                <th>Night Doctor ID</th>
                <th>Floor Number</th>
                <th>Nurse ID 1</th>
                <th>Nurse ID 2</th>
              </tr>
            </thead>
            <tbody>
              {allocatedCabins.map((cabin) => (
                <tr key={cabin.CABIN_NO}>
                  <td>{cabin.CABIN_NO}</td>
                  <td>{cabin.CABIN_TYPE}</td>
                  <td>{cabin.DOCTOR_ID_DAY}</td>
                  <td>{cabin.DOCTOR_ID_NIGHT}</td>
                  <td>{cabin.FLOOR_NO}</td>
                  <td>{cabin.NURSE_ID_1}</td>
                  <td>{cabin.NURSE_ID_2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showWards && (
        <div className="wards">
          <h3>Allocated Wards</h3>
          <table>
            <thead>
              <tr>
                <th>Ward Number</th>
                <th>Floor Number</th>
                <th>Day Doctor ID</th>
                <th>Night Doctor ID</th>
                <th>Bed Number</th>
              </tr>
            </thead>
            <tbody>
              {allocatedWards.map((ward) => (
                <tr key={ward.WARD_ID}>
                  <td>{ward.WARD_NO}</td>
                  <td>{ward.FLOOR_NO}</td>
                  <td>{ward.DOCTOR_ID_DAY}</td>
                  <td>{ward.DOCTOR_ID_NIGHT}</td>
                  <td>{findAllocatedBed(ward)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAppointmentForm && (
        <AppointmentForm
          doctors={doctors}
          handleClose={() => setShowAppointmentForm(false)}
          handleSubmit={handleAppointmentSubmit}
          userData={userData}
        />
      )}
    </div>
  );
};

export default Patient;
