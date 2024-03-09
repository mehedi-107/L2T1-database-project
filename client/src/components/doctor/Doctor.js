import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Doctor.css';
import image1 from './logo2.png';
import LeaveApplication from './LeaveApplication';
import Notification from './Notification'; // Import Notification component

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

      {/* Doctor Info */}
      <div className="doctor-info">
        <div className="doctor-profile-picture">
          <img src="data:image/jpeg;base64,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" alt="Profile" />
        </div>
        <div className="doctor-personal-details">
          <div className="doctor-info-item">
            <span className="doctor-info-label">User ID:</span>
            <span className="doctor-info-value"> {userData.user.DOCTOR_ID}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Name:</span>
            <span className="doctor-info-value"> {`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Email:</span>
            <span className="doctor-info-value"> {userData.user.EMAIL}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Date of Birth:</span>
            <span className="doctor-info-value">{userData.user.DATE_OF_BIRTH.split('T')[0]}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Contact No:</span>
            <span className="doctor-info-value">{userData.user.CONTACT_NO}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Salary:</span>
            <span className="doctor-info-value">{userData.user.SALARY}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Department:</span>
            <span className="doctor-info-value">{userData.user.DEPT_ID}</span>
          </div>
          <div className="doctor-info-item">
            <span className="doctor-info-label">Gender:</span>
            <span className="doctor-info-value">{userData.user.GENDER}</span>
          </div>
        </div>
      </div>
      
      {/* Leave Application */}
      {showLeaveApplication && (
        <LeaveApplication staffId={userData.user.DOCTOR_ID} />
      )}
      
      {/* Update Profile */}


      <footer className="doctor-footer">
        <p>&copy; 2021 Health Harbor</p>
      </footer>
    </div>
  );
};

export default Doctor;
