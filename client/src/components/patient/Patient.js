import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Patient.css';
import image1 from './logo2.png';
import FindADoctor from './FindADoctor';
import PatientInfo from './PatientInfo';
import CabinDetails from './CabinDetails';
import WardDetails from './WardDetails';
import AppointmentDetails from './AppointmentDetails';
import Notification from './Notification';

const Patient = ({ userData, onLogout }) => {
  const [showAppointments, setShowAppointments] = useState(false);
  const [showCabins, setShowCabins] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [allocatedCabins, setAllocatedCabins] = useState([]);
  const [allocatedWards, setAllocatedWards] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/appointments?patientId=${userData.user.PATIENT_ID}`);
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
        const response = await fetch(`/cabinInfoforPatient/${userData.user.PATIENT_ID}`);
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
        const response = await fetch(`/patientInfoforWard/${userData.user.PATIENT_ID}`);
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

  const handleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError(null);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await fetch(`/changePassword/${userData.user.PATIENT_ID}/${currentPassword}/${newPassword}/patient`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.error) {
        setChangePasswordError(data.error);
      } 
      else if (data.triggerMessage==='REQUIRED CRITERIA NOT FULFILLED')
      {
        setChangePasswordError('Password should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character');
      }
      else if(data.triggerMessage==='Invalid current password')
      {
        setChangePasswordError('Current password is incorrect');
      }

      else {
        alert('Password changed successfully');
        setShowPopup(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangePasswordError(null);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setChangePasswordError('An error occurred while changing the password.');
    }
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav>
          <Link to="/" onClick={onLogout}>Logout</Link>
          <Link onClick={handleAppointmentsClick}>Appointments</Link>
          <Link onClick={handleCabinsClick}>Cabins</Link>
          <Link onClick={handleWardsClick}>Wards</Link>
          <Link onClick={handleNotification}>Notifications</Link>
          <button onClick={() => setShowPopup(true)}>Change Password</button>
        </nav>
      </header>

      {showNotification && (
        <Notification patientId={userData.user.PATIENT_ID} onClose={handleNotification} />
      )}

      {showPopup && (
        <div className="patient-popup">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Save</button>
          <button onClick={handlePopupClose}>Cancel</button>
          {changePasswordError && <p className="patient-error-msg">{changePasswordError}</p>}
        </div>
      )}


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
