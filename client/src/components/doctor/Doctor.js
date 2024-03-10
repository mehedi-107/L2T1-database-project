import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Doctor.css';
import image1 from './logo2.png';
import LeaveApplication from './LeaveApplication';
import Notification from './Notification'; // Import Notification component
import DoctorInfo from './DoctorInfo';
import HospitalSituationBlog from './HospitalSituationBlog';

const Doctor = ({ userData }) => {
  console.log("userData", userData);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [showLeaveApplication, setShowLeaveApplication] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility
  
  const handleLeaveApplication = () => {
    setShowLeaveApplication(true);
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
     
      const response = await fetch(`http://localhost:5000/changePassword/${userData.user.DOCTOR_ID}/${currentPassword}/${newPassword}/doctor`);
      const data = await response.json();
      console.log(data);
      if (data.error) {
        setChangePasswordError(data.error);
      } 
        else if(data.triggerMessage ==='PASSWORD DOES NOT MEET CRITERIA'){
          setChangePasswordError('Password should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character');
          
        }
        else if(data.triggerMessage ==='Invalid current password'){
          setChangePasswordError('Invalid current password');
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

  const handleDiscardChanges = () => {
    setShowPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError(null);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };
  
  const handleNotification = () => {
    setShowNotification(!showNotification); // Toggle notification visibility
  };


  return (
    <div className="doctor-container">
      <header className="doctor-header">
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav className="navbar">
          <ul className='doctorul'>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/tasklist" state={userData}>Task List</Link></li>
            
            <li className="doctor-dropdown">
            
              <button className="dropbtn">More</button>
              <div className="doctor-dropdown-content">
                <button onClick={handleLeaveApplication}>Leave Application</button>
                <button onClick={() => setShowPopup(true)}>Change Password</button>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleNotification}>Notification</button>  
              </div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Popup */}
      {showPopup && (
        <div className="doctor-popup">
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
          <button onClick={handleDiscardChanges}>Discard</button>
          {changePasswordError && <p className="doctor-error-msg">{changePasswordError}</p>}
        </div>
      )}
       {showNotification && (
        <Notification doctorId={userData.user.DOCTOR_ID} onClose={handleNotification} /> // Render Notification component if showNotification is true
      )}
  {/* Leave Application */}
  <DoctorInfo userData={userData} />
  {showLeaveApplication && (
        <LeaveApplication staffId={userData.user.DOCTOR_ID} />
      )}
      
      {/* Doctor Info */}
      
      <HospitalSituationBlog userData={userData} />
      
    
      {/* Update Profile */}


      <footer className="doctor-footer">
        <p>&copy; 2021 Health Harbor</p>
      </footer>
    </div>
  );
};

export default Doctor;
