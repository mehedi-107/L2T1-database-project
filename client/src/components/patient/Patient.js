import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Patient.css';
import image1 from './logo2.png';
import FindADoctor from './FindADoctor';
import PatientInfo from './PatientInfo';
import CabinDetails from './CabinDetails';
import WardDetails from './WardDetails';
import AppointmentDetails from './AppointmentDetails';

const Patient = ({ userData }) => {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showCabins, setShowCabins] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allocatedCabins, setAllocatedCabins] = useState([]);
  const [allocatedWards, setAllocatedWards] = useState([]);

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
        const response = await fetch(`http://localhost:5000/cabinInfoforPatient/${userData.user.PATIENT_ID}`);
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
        const response = await fetch(`http://localhost:5000/patientInfoforWard/${userData.user.PATIENT_ID}`);
        const data = await response.json();
        setAllocatedWards(data);
      } catch (error) {
        console.error('Error fetching allocated wards:', error);
      }
    };

    fetchAllocatedWards();
  }, [userData.user.PATIENT_ID]);

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

  return (
    <div>
      <header>
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav>
          <Link to="/">Logout</Link>
          <Link onClick={handleAppointmentsClick}>Appointments</Link>
          <Link onClick={handleCabinsClick}>Cabins</Link>
          <Link onClick={handleWardsClick}>Wards</Link>
        </nav>
      </header>
      <div className="patient-container">
        <div className="header">
          <h2>Patient Information</h2>
          <div className="patient-details">
            <div className="patient-image">{/* Add patient image here */}</div>
            <PatientInfo userData={userData} />
          </div>
        </div>

        <div className="actions">
          {/* buttons removed */}
        </div>

        {showAppointments && <AppointmentDetails appointments={appointments} />}
        {showCabins && <CabinDetails cabin={allocatedCabins} />}
        {showWards && <WardDetails ward={allocatedWards} />}
      </div>
      <div className="find-a-doctor">
        <FindADoctor patient={userData.user} />
      </div>
      <footer className="footer">
        <p>&copy; 2024 Your Hospital Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Patient;
